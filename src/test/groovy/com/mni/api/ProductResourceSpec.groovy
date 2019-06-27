package com.mni.api

import com.mni.model.Product
import com.mni.model.ProductRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Shared
import spock.lang.Specification

/**
 * Created by charles.liu on 6/26/19.
 */
class ProductResourceSpec extends Specification {

    ProductResource productResource;
    @Shared String longName = "NameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLong"

    void setup(){
        productResource = new ProductResource()
        productResource.productRepository = Mock(ProductRepository)
    }

    void "getProduct() should return a ProductDto object when called with a valid ID" () {
        when:
        "getProduct(1) is called"
        def result = productResource.getProduct(1)

        then:
        "productRepository should call findById(1), which will return a Product object"
        1 * productResource.productRepository.findById(1) >> Optional.of(
                new Product(1, "US Data"))

        and:
        "The product returned by getProduct() should be the same as the product given by the repository"
        result instanceof ProductDto
        result.getId() == 1L;
        result.getName() == "US Data"
    }

    void "getProduct() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getProduct() is called with an invalid ID"
        def result = productResource.getProduct(-1)

        then:
        "productRepository should call findById(-1), which will return an empty Optional object"
        1 * productResource.productRepository.findById(-1) >> Optional.empty()

        and:
        "The result from getProduct() should be null"
        thrown(ResponseStatusException)
        result == null
    }

    void "saveProduct() with a new name should return a new persisted product" () {
        when:
        "saveProduct() is called with a valid new name"
        def result = productResource.saveProduct(new ProductDto(null, "US Data"))

        then:
        "productRepository should call save, returning the saved Product object"
        1 * productResource.productRepository.save({ Product product ->
            product.getName() == "US Data"
        }) >> new Product(120, "US Data")

        and:
        "Returned product should be the persisted ProductDto object"
        result instanceof ProductDto
        result.getId() == 120L
        result.getName() == "US Data"
    }

    void "listProducts() should return the current products" () {
        given:
        def products = new PageImpl([
                new Product(1, "Product 1"),
                new Product(2, "Product 2")
        ])

        when:
        "listProducts() is called"
        def result = productResource.listProducts(0, 20, "id", true).getContent()

        then:
        "Call findAll(), returning list of products"
        1 * productResource.productRepository.findAll(_) >> products

        and:
        "Correct products are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getName() == "Product 1"

        result[1].getId() == 2L
        result[1].getName() == "Product 2"
    }

    void "listProducts() should use default parameters given invalid parameters" () {
        given:
        def products = new PageImpl([
                new Product(1, "Product 1"),
                new Product(2, "Product 2")
        ])

        when:
        "listProducts() is given invalid parameters"
        productResource.listProducts(-1, -1, "NOT A SORT FIELD", false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * productResource.productRepository.findAll({ Pageable pageRequest ->
                    pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == ProductResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == ProductResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            ProductResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }) >> products
    }

    void "deleteProduct(id) should call deleteById() to delete the product" () {
        when:
        "deleteProduct(1) is called"
        productResource.deleteProduct(1)

        then:
        "deleteById(1) should be called"
        1 * productResource.productRepository.deleteById(1)
    }

    void "updateProduct() should call save() to save product and return new product" () {
        given:
        ProductDto pdto = new ProductDto(1, "New Name")

        when:
        "updateProduct() is called"
        def result = productResource.updateProduct(1, pdto)

        then:
        "save() should be called"
        1 * productResource.productRepository.save({ Product product ->
            product.getId() == 1L &&
                    product.getName() == "New Name"
        }) >> new Product(1L, "New Name")

        and:
        "Correct result should be returned"
        result instanceof ProductDto
        result.getId() == pdto.getId()
        result.getName() == pdto.getName()
    }
}
