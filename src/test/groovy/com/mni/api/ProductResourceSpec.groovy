package com.mni.api

import com.mni.api.product.ProductDto
import com.mni.api.product.ProductResource
import com.mni.model.multicastgroup.MulticastGroup
import com.mni.model.product.Product
import com.mni.model.product.ProductRepository
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

    @Shared ArrayList<MulticastGroup> multicastGroups
    @Shared ProductResource productResource

    void setupSpec() {
        multicastGroups = new ArrayList<>()
        multicastGroups.add(new MulticastGroup(1, "Example Group", "192.168.1.1", 4000))
    }

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
                new Product(1, "US Data", multicastGroups))

        and:
        "The product returned by getProduct() should be the same as the product given by the repository"
        result instanceof ProductDto
        result.getId() == 1L
        result.getName() == "US Data"
        result.getMulticastGroups() == multicastGroups
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
        def result = productResource.saveProduct(new ProductDto(null, "US Data", multicastGroups))

        then:
        "productRepository should call save, returning the saved Product object"
        1 * productResource.productRepository.save({ Product product ->
            product.getName() == "US Data"
        }) >> new Product(120, "US Data", multicastGroups)

        and:
        "Returned product should be the persisted ProductDto object"
        result instanceof ProductDto
        result.getId() == 120L
        result.getName() == "US Data"
        result.getMulticastGroups() == multicastGroups
    }

    void "listProducts() should return the current products" () {
        given:
        def products = new PageImpl([
                new Product(1, "Product 1", multicastGroups),
                new Product(2, "Product 2", multicastGroups)
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
        result[0].getMulticastGroups() == multicastGroups

        result[1].getId() == 2L
        result[1].getName() == "Product 2"
        result[1].getMulticastGroups() == multicastGroups
    }

    void "listProducts() should use default parameters given invalid parameters" () {
        given:
        def products = new PageImpl([
                new Product(1, "Product 1", multicastGroups),
                new Product(2, "Product 2", multicastGroups)
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
        ProductDto productDto = new ProductDto(1, "New Name", multicastGroups)

        when:
        "updateProduct() is called"
        def result = productResource.updateProduct(1, productDto)

        then:
        "save() should be called"
        1 * productResource.productRepository.save({ Product product ->
            product.getId() == 1L &&
                    product.getName() == "New Name" && product.getMulticastGroups() == multicastGroups
        }) >> new Product(1L, "New Name", multicastGroups)

        and:
        "Correct result should be returned"
        result instanceof ProductDto
        result.getId() == productDto.getId()
        result.getName() == productDto.getName()
        result.getMulticastGroups() == multicastGroups
    }
}
