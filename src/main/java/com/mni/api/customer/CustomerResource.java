package com.mni.api.customer;

import com.mni.api.entitlement.EntitlementDto;
import com.mni.model.customer.Customer;
import com.mni.model.customer.CustomerRepository;
import com.mni.model.entitlement.Entitlement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;

import static com.mni.api.customer.CustomerDto.translateCustomerDtoToCustomer;
import static com.mni.api.customer.CustomerDto.translateCustomerToCustomerDto;

/**
 * Created by will.schick on 6/17/19.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerResource {

    private static final Logger logger = LoggerFactory.getLogger(CustomerResource.class);

    @Autowired
    private CustomerRepository customerRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "name";

    // Returns whether a String is a field of Customer
    private boolean isSortableField(String field) {
        return field.equals("id") || field.equals("name") || field.equals("userId") ||
                field.equals("password") || field.equals("clientType") || field.equals("priority");
    }

    //Attempt to save a customer, returns HTTP 400 Bad Request if something goes wrong
    private Customer trySaveCustomer(Customer customer) {
        try{
            if(customer.getEntitlements() == null) customer.setEntitlements(new ArrayList());
            return customerRepository.save(customer);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException)
                // This happens when unique index or primary key violation occurs
                // or invalid data
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name or UserID already taken");

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for customer");
        }
    }

    @GetMapping
    public Page<CustomerDto> listCustomers(@RequestParam(value="page", defaultValue="0") int page,
                                           @RequestParam(value="size", defaultValue=DEFAULT_PAGE_SIZE + "")
                                              int size,
                                           @RequestParam(value="sortBy", defaultValue=DEFAULT_SORT_FIELD)
                                                  String sortBy,
                                           @RequestParam(value="desc", defaultValue="false") boolean desc,
                                           @RequestParam(value="disabled", defaultValue="false") boolean disabled
    ){
        logger.debug("GET received: page=" + page + ", size=" + size + ", sortBy='" +
                sortBy + "', desc=" + desc + ", disabled=" + disabled);
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isSortableField(sortBy)) sortBy = DEFAULT_SORT_FIELD;
        logger.trace("GET validated: page=" + page + ", size=" + size + ", sortBy='" +
                sortBy + "', desc=" + desc + ", disabled=" + disabled);

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        if(!order.equals("password")) order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);

        Page<Customer> customers = customerRepository.findByDisabled(pageRequest, disabled);
        logger.trace("GET findAll returned: " + customers.getContent());
        Page<CustomerDto> customerDtos = customers.map(CustomerDto::translateCustomerToCustomerDto);
        logger.debug("GET returning: " + customerDtos.getContent());
        return customerDtos;
    }

    private Customer getPersistedCustomer(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if(!customer.isPresent()) {
            logger.debug("Could not find customer with ID " + id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        }
        Customer returnCustomer = customer.get();
        logger.trace("findById returned: " + returnCustomer);
        return returnCustomer; // Valid ID
    }

    @GetMapping("{id}")
    public CustomerDto getCustomer(@PathVariable("id") Long id){
        logger.debug("GET with ID " + id + " received.");

        Customer customer = getPersistedCustomer(id);
        CustomerDto customerDto = translateCustomerToCustomerDto(customer);
        logger.debug("GET with ID " + id + " returned: " + customerDto);
        return customerDto;
    }

    @GetMapping("{id}/entitlements")
    public Collection<EntitlementDto> getCustomerEntitlements(@PathVariable("id") Long id) {
        logger.debug("GET Entitlements request received for ID " + id);

        Collection<Entitlement> entitlements = getPersistedCustomer(id).getEntitlements();
        Collection<EntitlementDto> entitlementDtos = EntitlementDto.entitlementsToEntitlementDtos(entitlements);
        logger.debug("GET Entitlements with ID " + id + " returned: " + entitlementDtos);
        return entitlementDtos;
    }

    @PostMapping
    public CustomerDto saveCustomer(@Valid @RequestBody CustomerDto customerDto) {
        logger.debug("POST Received: " + customerDto);
        Customer inputCustomer = translateCustomerDtoToCustomer(customerDto);
        inputCustomer.setId(null); // ID should be autogenerated
        logger.trace("POST attempting to save: " + inputCustomer);

        Customer persistedCustomer = trySaveCustomer(inputCustomer);
        logger.info("POST saved new Customer: " + persistedCustomer);
        CustomerDto returnCustomer = translateCustomerToCustomerDto(persistedCustomer);
        logger.trace("POST returning: " + returnCustomer);
        return returnCustomer;
    }

    @PutMapping("{id}")
    public CustomerDto updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto customerDto) {
        logger.debug("PUT with ID " + id + " received: " + customerDto);
        Customer customer = getPersistedCustomer(id);

        Customer inputCustomer = translateCustomerDtoToCustomer(customerDto);
        inputCustomer.setId(id);
        inputCustomer.setEntitlements(customer.getEntitlements());
        logger.trace("PUT with ID " + id + " attempting to save: " + inputCustomer);

        Customer savedCustomer = trySaveCustomer(inputCustomer);
        logger.info("PUT with ID " + id + " updated Customer to: " + savedCustomer);
        CustomerDto returnCustomer = translateCustomerToCustomerDto(savedCustomer);
        logger.trace("PUT with ID " + id + " returning: " + returnCustomer);
        return returnCustomer;
    }

    @PutMapping("{id}/entitlements")
    public Collection<EntitlementDto> updateCustomerEntitlements(@PathVariable Long id,
                                                                 @NotNull @Valid @RequestBody
                                                                         Collection<EntitlementDto> entitlementDtos) {
        logger.debug("PUT Entitlements request with ID " + id + " received: " + entitlementDtos);
        Customer customer = getPersistedCustomer(id);

        Collection<Entitlement> entitlements = EntitlementDto.entitlementDtosToEntitlements(entitlementDtos);
        logger.trace("PUT entitlements' client fields are being set to customer");
        entitlements.forEach(e -> {
            e.setClient(customer);
        });
        customer.setEntitlements(entitlements);

        logger.trace("PUT Entitlements with ID " + id + " attempting to save: " + customer);
        Customer persistedCustomer = trySaveCustomer(customer);
        logger.info("PUT Entitlements with ID " + id + " updated Customer to: " + persistedCustomer);
        Collection<EntitlementDto> returnEntitlements =
                EntitlementDto.entitlementsToEntitlementDtos(persistedCustomer.getEntitlements());
        logger.trace("PUT Entitlements with ID " + id + " returning: " + returnEntitlements);
        return returnEntitlements;
    }

    @DeleteMapping("{id}")
    public void deleteCustomer(@PathVariable Long id) {
        logger.debug("DELETE with ID " + id + " received");
        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if(optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            customer.getEntitlements().size(); // Load entitlements since fetch is lazy
            customerRepository.deleteById(id);
            logger.info("DELETE with ID " + id + " deleted " + customer);
        }else {
            logger.debug("DELETE with ID " + id + " had invalid ID");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
