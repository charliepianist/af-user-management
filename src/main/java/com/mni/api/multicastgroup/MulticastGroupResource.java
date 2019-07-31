package com.mni.api.multicastgroup;

import com.mni.api.product.ProductDto;
import com.mni.model.multicastgroup.MulticastGroup;
import com.mni.model.multicastgroup.MulticastGroupRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Optional;

import static com.mni.api.multicastgroup.MulticastGroupDto.translateMulticastGroupDtoToMulticastGroup;
import static com.mni.api.multicastgroup.MulticastGroupDto.translateMulticastGroupToMulticastGroupDto;

@RestController
@RequestMapping("/api/multicast-groups")
public class MulticastGroupResource {

    private static final Logger logger = LoggerFactory.getLogger(MulticastGroupResource.class);

    @Autowired
    private MulticastGroupRepository multicastGroupRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "name";

    // Returns whether a String is a sortable field of MulticastGroup
    private boolean isSortableField(String field) {
        return field.equals("id") || field.equals("name") || field.equals("ip") || field.equals("port") ||
                field.equals("autoAssign") || field.equals("code");
    }

    //Attempt to save a multicast group, returns HTTP 400 Bad Request if something goes wrong
    private MulticastGroup trySaveMulticastGroup(MulticastGroup multicastGroup) {
        try{
            return multicastGroupRepository.save(multicastGroup);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException) {
                // Unique index violation (Name or Code)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name or code already taken");
            }

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for new multicastGroup");
        }
    }

    @GetMapping
    public Page<MulticastGroupDto> listMulticastGroups(@RequestParam(value="page", defaultValue="0") int page,
                                           @RequestParam(value="size", defaultValue=DEFAULT_PAGE_SIZE + "")
                                                   int size,
                                           @RequestParam(value="sortBy", defaultValue=DEFAULT_SORT_FIELD)
                                                   String sortBy,
                                           @RequestParam(value="desc", defaultValue="false") boolean desc
    ){
        logger.debug("GET received: page=" + page + ", size=" + size + ", sortBy='" +
                sortBy + "', desc=" + desc);
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isSortableField(sortBy)) sortBy = DEFAULT_SORT_FIELD;
        logger.trace("GET validated: page=" + page + ", size=" + size +
                ", sortBy='" + sortBy + "', desc=" + desc);

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);

        Page<MulticastGroup> groups = multicastGroupRepository.findAll(pageRequest);
        logger.trace("GET findAll returned: " + groups.getContent());
        Page<MulticastGroupDto> groupDtos = groups.map(
                MulticastGroupDto::translateMulticastGroupToMulticastGroupDto);
        logger.debug("GET returning: " + groupDtos.getContent());
        return groupDtos;
    }


    @GetMapping("{id}")
    public MulticastGroupDto getMulticastGroup(@PathVariable("id") Long id){
        logger.debug("GET with ID " + id + " received.");
        Optional<MulticastGroup> multicastGroup = multicastGroupRepository.findById(id);

        if(!multicastGroup.isPresent()) {
            logger.debug("GET with ID " + id + " did not find a MulticastGroup");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        }

        MulticastGroup group = multicastGroup.get();
        logger.trace("GET with ID " + id + " findById returned: " + group);
        MulticastGroupDto groupDto = translateMulticastGroupToMulticastGroupDto(group);
        logger.debug("GET with ID " + id + " returned: " + groupDto);
        return groupDto; //Valid ID
    }

    @GetMapping("{id}/products")
    public Collection<ProductDto> getMulticastGroupProducts(@PathVariable("id") Long id) {
        logger.debug("GET Products with ID " + id + " received.");
        Optional<MulticastGroup> multicastGroup = multicastGroupRepository.findById(id);

        if(!multicastGroup.isPresent()) {
            logger.debug("GET Products with ID " + id + " did not find a MulticastGroup");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        MulticastGroup group = multicastGroup.get();
        logger.trace("GET Products with ID " + id + " findById returned: " + group);
        Collection<ProductDto> productDtos = ProductDto.translateProductsToProductDtos(group.getProducts());
        logger.debug("GET Products with ID " + id + " returned: " + productDtos);
        return productDtos;
    }

    @PostMapping
    public MulticastGroupDto saveMulticastGroup(@Valid @RequestBody MulticastGroupDto multicastGroupDto) {
        logger.debug("POST Received: " + multicastGroupDto);
        MulticastGroup inputMulticastGroup = translateMulticastGroupDtoToMulticastGroup(multicastGroupDto);
        inputMulticastGroup.setId(null); // ID should be autogenerated
        logger.trace("POST attempting to save: " + inputMulticastGroup);

        MulticastGroup persistedMulticastGroup = trySaveMulticastGroup(inputMulticastGroup);
        logger.info("POST saved new Multicast Group: " + persistedMulticastGroup);
        MulticastGroupDto returnGroup = translateMulticastGroupToMulticastGroupDto(persistedMulticastGroup);
        logger.trace("POST returning: " + returnGroup);
        return returnGroup;
    }

    @PutMapping("{id}")
    public MulticastGroupDto updateMulticastGroup(@PathVariable Long id, @Valid @RequestBody MulticastGroupDto multicastGroupDto) {
        logger.debug("PUT with ID " + id + " received: " + multicastGroupDto);
        if(!multicastGroupRepository.existsById(id)) {
            logger.debug("PUT with ID " + id + " did not find a MulticastGroup");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        MulticastGroup inputMulticastGroup = translateMulticastGroupDtoToMulticastGroup(multicastGroupDto);
        inputMulticastGroup.setId(id);
        logger.trace("PUT with ID " + id + " attempting to save: " + inputMulticastGroup);

        MulticastGroup savedMulticastGroup = trySaveMulticastGroup(inputMulticastGroup);
        logger.info("PUT with ID " + id + " updated Multicast Group to: " + savedMulticastGroup);
        MulticastGroupDto returnGroup = translateMulticastGroupToMulticastGroupDto(savedMulticastGroup);
        logger.trace("PUT with ID " + id + " returning: " + returnGroup);
        return returnGroup;
    }

    @DeleteMapping("{id}")
    public void deleteMulticastGroup(@PathVariable Long id) {
        logger.debug("DELETE with ID " + id + " received");
        Optional<MulticastGroup> optionalMulticastGroup = multicastGroupRepository.findById(id);
        if(optionalMulticastGroup.isPresent()) {
            MulticastGroup group = optionalMulticastGroup.get();
            logger.trace("DELETE with ID " + id + " removing references to self in products");
            group.getProducts().forEach(product -> {
                product.removeMulticastGroup(group);
            });

            multicastGroupRepository.deleteById(id);
            logger.info("DELETE with ID " + id + " deleted " + group);
        }else {
            logger.debug("DELETE with ID " + id + " had invalid ID");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
