package com.mni.api.product;

import com.mni.api.multicastgroup.MulticastGroupDto;
import com.mni.model.multicastgroup.MulticastGroup;
import com.mni.model.multicastgroup.MulticastGroupRepository;
import com.mni.model.product.Product;
import com.mni.model.product.ProductRepository;
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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.mni.api.product.ProductDto.translateProductDtoToProduct;
import static com.mni.api.product.ProductDto.translateProductToProductDto;

/**
 * Created by charles.liu on 6/26/19.
 */

@RestController
@RequestMapping("/api/products")
public class ProductResource {

    private static final Logger logger = LoggerFactory.getLogger(ProductResource.class);

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private MulticastGroupRepository multicastGroupRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "name";



    // Returns whether a String is a sortable field of Product
    private boolean isSortableField(String field) {
        return field.equals("id") || field.equals("name");
    }

    //Attempt to save a product, returns HTTP 400 Bad Request if something goes wrong
    private Product trySaveProduct(Product product) {
        try{
            if(product.getMulticastGroups() == null) product.setMulticastGroups(new ArrayList());
            return productRepository.save(product);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException)
                // Unique index violation (ID or Name)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name already taken");

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for new product");
        }
    }

    @GetMapping
    public Page<ProductDto> listProducts(@RequestParam(value="page", defaultValue="0") int page,
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
        logger.trace("GET validated: page=" + page + ", size=" + size + ", sortBy='" +
                sortBy + "', desc=" + desc);

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findAll(pageRequest);
        logger.trace("GET findAll returned: " + products.getContent());
        Page<ProductDto> productDtos = products.map(ProductDto::translateProductToProductDto);
        logger.debug("GET returning: " + productDtos.getContent());
        return productDtos;
    }

    private Product getPersistedProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if(!product.isPresent()) {
            logger.debug("Could not find product with ID " + id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        }
        Product returnProduct = product.get();
        logger.trace("findById returned: " + returnProduct);
        return returnProduct;
    }

    @GetMapping("{id}")
    public ProductDto getProduct(@PathVariable("id") Long id) {
        logger.debug("GET with ID " + id + " received.");

        Product product = getPersistedProduct(id);
        ProductDto productDto = translateProductToProductDto(product);
        logger.debug("GET with ID " + id + " returned: " + productDto);
        return productDto; //Valid ID
    }

    @GetMapping("{id}/multicast-groups")
    public Collection<MulticastGroupDto> getProductMulticastGroups(@PathVariable("id") Long id) {
        logger.debug("GET Multicast Groups request received for ID " + id);

        Collection<MulticastGroup> groups = getPersistedProduct(id).getMulticastGroups();
        logger.trace("GET Multicast Groups with ID " + id + " product's multicast groups: " + groups);

        groups.addAll(multicastGroupRepository.findByAutoAssign(true));
        groups = groups.stream().collect(Collectors.toSet());
        Collection<MulticastGroupDto> groupDtos = MulticastGroupDto.multicastGroupsToMulticastGroupDtos(groups);
        logger.debug("GET Multicast Groups with ID " + id + " returned: " + groupDtos);
        return groupDtos;
    }

    @PostMapping
    public ProductDto saveProduct(@Valid @RequestBody ProductDto productDto) {
        logger.debug("POST Received: " + productDto);
        Product inputProduct = translateProductDtoToProduct(productDto);
        inputProduct.setId(null); // ID should be autogenerated
        logger.trace("POST attempting to save: " + inputProduct);

        Product persistedProduct = trySaveProduct(inputProduct);
        logger.info("POST saved new Product: " + persistedProduct);
        ProductDto returnProduct = translateProductToProductDto(persistedProduct);
        logger.trace("POST returning: " + returnProduct);
        return returnProduct;
    }

    @PutMapping("{id}")
    public ProductDto updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        logger.debug("PUT with ID " + id + " received: " + productDto);
        Product product = getPersistedProduct(id);

        Product inputProduct = translateProductDtoToProduct(productDto);
        inputProduct.setId(id);
        inputProduct.setMulticastGroups(product.getMulticastGroups());
        logger.trace("PUT with ID " + id + " attempting to save: " + inputProduct);

        Product savedProduct = trySaveProduct(inputProduct);
        logger.info("PUT with ID " + id + " updated Customer to: " + savedProduct);
        ProductDto returnProduct = translateProductToProductDto(savedProduct);
        logger.trace("PUT with ID " + id + " returning: " + returnProduct);
        return returnProduct;
    }

    @PutMapping("{id}/multicast-groups")
    public Collection<MulticastGroupDto> updateProductMulticastGroups(@PathVariable Long id,
                                                   @NotNull @RequestBody Collection<MulticastGroupDto> groupDtos) {
        logger.debug("PUT Multicast Groups request with ID " + id + " received: " + groupDtos);
        Product product = getPersistedProduct(id);

        // add references to product to its new multicast groups
        product.setMulticastGroups(MulticastGroupDto.multicastGroupDtosToMulticastGroups(groupDtos));

        logger.trace("PUT Multicast Groups with ID " + id + " attempting to save: " + product);
        Product persistedProduct = trySaveProduct(product);
        logger.info("PUT Multicast Groups with ID " + id + " updated Product to: " + persistedProduct);

        Collection<MulticastGroup> groups = persistedProduct.getMulticastGroups();
        groups.addAll(multicastGroupRepository.findByAutoAssign(true));
        groups = groups.stream().collect(Collectors.toSet());
        Collection<MulticastGroupDto> returnMulticastGroups =
                MulticastGroupDto.multicastGroupsToMulticastGroupDtos(groups);
        logger.trace("PUT Multicast Groups with ID " + id + " returning: " + returnMulticastGroups);
        return returnMulticastGroups;
    }

    @DeleteMapping("{id}")
    public void deleteProduct(@PathVariable Long id) {
        logger.debug("DELETE with ID " + id + " received");
        Optional<Product> optionalProduct = productRepository.findById(id);
        if(optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.getMulticastGroups().size(); // Load entitlements since fetch is lazy
            productRepository.deleteById(id);
            logger.info("DELETE with ID " + id + " deleted " + product);
        }else {
            logger.debug("DELETE with ID " + id + " had invalid ID");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
