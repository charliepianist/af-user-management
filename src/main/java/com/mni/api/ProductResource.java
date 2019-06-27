package com.mni.api;

import com.mni.model.Product;
import com.mni.model.ProductRepository;
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
import java.util.Optional;

/**
 * Created by charles.liu on 6/26/19.
 */

@RestController
@RequestMapping("/api/products")
public class ProductResource {

    @Autowired
    ProductRepository productRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "id";

    private ProductDto translateProductToProductDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        return productDto;
    }
    private Product translateProductDtoToProduct(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        return product;
    }

    // Returns whether a String is a field of Product
    private boolean isProductField(String field) {
        return field.equals("id") || field.equals("name");
    }

    // Checks Name, UserID, and Password lengths
    private void validateProduct(Product product) {
        if(product.getName() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot be null");
        if(product.getName().length() == 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot be empty");

        // validate correct lengths
        if(product.getName().length() > Product.MAX_NAME_LENGTH)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot have over " + Product.MAX_NAME_LENGTH + " characters");
    }

    //Attempt to save a product, returns HTTP 400 Bad Request if something goes wrong
    private Product trySaveProduct(Product product) {
        try{
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
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isProductField(sortBy)) sortBy = DEFAULT_SORT_FIELD;

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);
        return productRepository
                .findAll(pageRequest)
                .map(this::translateProductToProductDto);
    }


    @GetMapping("{id}")
    ProductDto getProduct(@PathVariable("id") Long id){
        Optional<Product> product = productRepository.findById(id);

        if(!product.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        return translateProductToProductDto(product.get()); //Valid ID
    }

    @PostMapping
    ProductDto saveProduct(@Valid @RequestBody ProductDto productDto) {
        Product inputProduct = translateProductDtoToProduct(productDto);
        validateProduct(inputProduct); // throw exception if name invalid
        inputProduct.setId(null); // ID should be autogenerated

        return translateProductToProductDto(trySaveProduct(inputProduct));
    }

    @PutMapping("{id}")
    ProductDto updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        Product inputProduct = translateProductDtoToProduct(productDto);
        validateProduct(inputProduct);

        inputProduct.setId(id);
        return translateProductToProductDto(trySaveProduct(inputProduct));
    }

    @DeleteMapping("{id}")
    void deleteProduct(@PathVariable Long id) {
        try {
            productRepository.deleteById(id);
        }catch(EmptyResultDataAccessException e) {
            // Product with ID id does not exist
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}