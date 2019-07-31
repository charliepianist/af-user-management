package com.mni.api.config;

import com.mni.model.customer.Customer;
import com.mni.model.entitlement.Entitlement;
import com.mni.model.entitlement.EntitlementRepository;
import com.mni.model.location.LocationRepository;
import com.mni.model.multicastgroup.MulticastGroup;
import com.mni.model.multicastgroup.MulticastGroupRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/config")
public class MulticastConfigResource {

    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private MulticastGroupRepository multicastGroupRepository;
    @Autowired
    private EntitlementRepository entitlementRepository;

    private static final Logger logger = LoggerFactory.getLogger(MulticastConfigResource.class);

    private void validateLocationCode(String code) {
        if(!locationRepository.existsByCode(code)) {
            logger.debug("Location not found with code " + code);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid location code");
        }
    }

    @GetMapping("{code}/multicastconfig.txt")
    public String getMulticastConfig(@PathVariable("code") String code) {
        logger.debug("GET Multicast Config with code " + code + " received");
        validateLocationCode(code);
        // Get Entitlements with given Location, map to Products (all products at
        // that location), then find those products' multicast groups
        Set<MulticastGroup> locationGroups =
                entitlementRepository
                        .findByLocation_Code(code)
                        .stream()
                        .filter(entitlement -> !entitlement.getClient().isDisabled())
                        .map(entitlement -> entitlement.getProduct())
                        .flatMap(prod -> prod.getMulticastGroups().stream())
                        .filter(group -> !group.isAutoAssign())
                        .collect(Collectors.toSet());
        // Add all auto-assigned Multicast Groups
        locationGroups.addAll(multicastGroupRepository.findByAutoAssign(true));
        logger.trace("Groups found at location " + code + " : " + locationGroups);

        ArrayList<MulticastGroup> sortedGroups = new ArrayList(locationGroups);
        Collections.sort(sortedGroups, Comparator.comparing(MulticastGroup::getCode));
        logger.trace("Sorted groups found at location " + code + " : " + sortedGroups);
        String fileString = generateMulticastConfigFile(sortedGroups);
        logger.debug("GET Multicast Config with code " + code + " returned:\n" + fileString);
        return fileString;
    }

    private String generateMulticastConfigFile(List<MulticastGroup> groups) {
        StringBuilder builder = new StringBuilder();
        for(int i = 0; i < groups.size(); i++) {
            MulticastGroup group = groups.get(i);
            addGroupLine(builder, group);
            if(i < groups.size() - 1) builder.append("\n");
        }
        return builder.toString();
    }

    private void addGroupLine(StringBuilder builder, MulticastGroup group) {
        builder.append(group.getCode());
        builder.append("\t");
        builder.append(group.getIp());
        builder.append(":");
        builder.append(group.getPort());
        builder.append("\tE");
    }

    @GetMapping("{code}/userconfig.txt")
    public String getUserConfig(@PathVariable("code") String code) {
        logger.debug("GET User Config with code " + code + " received");
        validateLocationCode(code);
        List<Entitlement> locationEntitlements =
                entitlementRepository
                .findByLocation_Code(code)
                .stream()
                .filter(entitlement -> !entitlement.getClient().isDisabled())
                .collect(Collectors.toList());
        logger.trace("Entitlements found at location " + code + " : " + locationEntitlements);

        Collections.sort(locationEntitlements, (e1, e2) -> {
            Long diff = e1.getClient().getId() - e2.getClient().getId();
            if(diff > 0) return 1;
            if(diff < 0) return -1;
            return 0;
                }); // Sort entitlements by Customer ID
        logger.trace("Sorted entitlements found at location " + code + " : " + locationEntitlements);

        String fileString = generateUserConfigFile(locationEntitlements);
        logger.debug("GET User Config with code " + code + " returned:\n" + fileString);
        return fileString;
    }

    private String generateUserConfigFile(List<Entitlement> entitlements) {
        StringBuilder builder = new StringBuilder();
        Customer currentCust = null;
        Set<MulticastGroup> autoAssigned = multicastGroupRepository.findByAutoAssign(true);
        Set<MulticastGroup> groups = new HashSet();
        Integer numLogins = -1;

        // Collect customer's groups and max num logins, add lines when new customer encountered
        for(Entitlement e : entitlements) {
            if(currentCust == null || !currentCust.getId().equals(e.getClient().getId())) {
                if(currentCust != null) {
                    addCustomerLine(builder, currentCust, numLogins, groups);
                    builder.append("\n");
                }
                currentCust = e.getClient();
                numLogins = e.getNumLogins();
                groups = new HashSet(autoAssigned);
            }
            // Add groups and check if numLogins needs to be increased
            groups.addAll(e.getProduct().getMulticastGroups());
            if(e.getNumLogins() > numLogins) numLogins = e.getNumLogins();
        }
        addCustomerLine(builder, currentCust, numLogins, groups);

        return builder.toString();
    }

    private void addCustomerLine(StringBuilder builder, Customer customer, Integer numLogins, Collection<MulticastGroup> groups) {
        builder.append(customer.getUserId());
        builder.append("\t");
        builder.append(customer.getPassword());
        builder.append("\t");
        builder.append(customer.getClientType());
        builder.append("\t");
        builder.append(numLogins);
        builder.append("\t");
        builder.append(customer.getPriority());
        builder.append("\t");
        builder.append(commaSeparatedCodes(groups));
    }

    private String commaSeparatedCodes(Collection<MulticastGroup> groups) {
        ArrayList<MulticastGroup> sortedGroups = new ArrayList(groups);
        Collections.sort(sortedGroups, Comparator.comparing(MulticastGroup::getCode));

        StringBuilder builder = new StringBuilder();
        for(int i = 0; i < sortedGroups.size(); i++) {
            MulticastGroup group = sortedGroups.get(i);
            builder.append(group.getCode());
            if(i < sortedGroups.size() - 1) builder.append(",");
        }
        return builder.toString();
    }
}
