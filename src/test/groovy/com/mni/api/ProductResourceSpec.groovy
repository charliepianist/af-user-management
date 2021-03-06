package com.mni.api

import com.mni.api.multicastgroup.MulticastGroupDto
import com.mni.api.product.ProductDto
import com.mni.api.product.ProductResource
import com.mni.model.multicastgroup.MulticastGroup
import com.mni.model.multicastgroup.MulticastGroupRepository
import com.mni.model.product.Product
import com.mni.model.product.ProductRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Shared
import spock.lang.Specification

class ProductResourceSpec extends Specification {

    @Shared ArrayList<MulticastGroup> multicastGroups
    @Shared ArrayList<MulticastGroupDto> multicastGroupDtos
    @Shared MulticastGroup heartbeat = new MulticastGroup(2, "Heartbeat", "Group_HEARTBEAT", true, "192.168.4.5", 1000)
    @Shared ProductResource productResource

    void setupSpec() {
        multicastGroups = new ArrayList<>()
        multicastGroups.add(new MulticastGroup(1, "Example Group", "Group_EXAMPLE_GROUP", false, "192.168.1.1", 4000))
        multicastGroupDtos = MulticastGroupDto.multicastGroupsToMulticastGroupDtos(multicastGroups);
    }

    void setup(){
        productResource = new ProductResource()
        productResource.productRepository = Mock(ProductRepository)
        productResource.multicastGroupRepository = Mock(MulticastGroupRepository)
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

    void "getProductMulticastGroups() should return correct groups when called with valid ID" () {
        when:
        "getProductMulticastGroups() is called"
        def result = productResource.getProductMulticastGroups(1)

        then:
        "productRepository should call findById(1), which will return a Product object"
        1 * productResource.productRepository.findById(1) >> Optional.of(
                new Product(1, "US Data", multicastGroups)
        )

        and:
        "findByAutoAssign can be called"
        (0..1) * productResource.multicastGroupRepository.findByAutoAssign(true) >>
                [heartbeat]

        and:
        "result should be the correct set of Multicast Groups"
        result instanceof Collection<MulticastGroupDto>
        (result[0].getId() == multicastGroupDtos.get(0).getId() && result[1].getId() == heartbeat.getId()) ||
                (result[1].getId() == multicastGroupDtos.get(0).getId() && result[0].getId() == heartbeat.getId())

        (result[0].getName() == multicastGroupDtos.get(0).getName() && result[1].getName() == heartbeat.getName()) ||
                (result[1].getName() == multicastGroupDtos.get(0).getName() && result[0].getName() == heartbeat.getName())

        (result[0].getPort() == multicastGroupDtos.get(0).getPort() && result[1].getPort() == heartbeat.getPort()) ||
                (result[1].getPort() == multicastGroupDtos.get(0).getPort() && result[0].getPort() == heartbeat.getPort())

        (result[0].getIp() == multicastGroupDtos.get(0).getIp() && result[1].getIp() == heartbeat.getIp()) ||
                (result[1].getIp() == multicastGroupDtos.get(0).getIp() && result[0].getIp() == heartbeat.getIp())
    }

    void "getProductMulticastGroups() should throw exception given invalid ID" () {
        when:
        "getProductMulticastGroups() is called"
        def result = productResource.getProductMulticastGroups(1)

        then:
        "productRepository should call findById(1), which will return an empty Product optional"
        1 * productResource.productRepository.findById(1) >> Optional.empty()

        and:
        "Exception should be thrown"
        thrown(ResponseStatusException)
    }

    void "saveProduct() with a new name should return a new persisted product" () {
        when:
        "saveProduct() is called with a valid new name"
        def result = productResource.saveProduct(new ProductDto(null, "US Data"))

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

        result[1].getId() == 2L
        result[1].getName() == "Product 2"
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
        "findById(1) can be called"
        (0..1) * productResource.productRepository.findById(1) >>
                Optional.of(new Product(1, "Product Name", multicastGroups))

        and:
        "deleteById(1) should be called"
        1 * productResource.productRepository.deleteById(1)
    }

    void "updateProduct() should call save() to save product and return new product" () {
        given:
        Product p = new Product(1, "Old Name", multicastGroups)
        ProductDto productDto = new ProductDto(1, "New Name")

        when:
        "updateProduct() is called"
        def result = productResource.updateProduct(1, productDto)

        then:
        "save() should be called"
        1 * productResource.productRepository.findById(1) >> Optional.of(p)
        1 * productResource.productRepository.save({ Product product ->
            product.getId() == 1L &&
                    product.getName() == "New Name"
        }) >> new Product(1L, "New Name", multicastGroups)

        and:
        "Correct result should be returned"
        result instanceof ProductDto
        result.getId() == productDto.getId()
        result.getName() == productDto.getName()
    }

    void "updateProductMulticastGroups() should call save() and return updated product" () {
        given:
        Product p = new Product(1L, "US Data", new ArrayList())

        when:
        "updateProductMulticastGroups() is called"
        def result = productResource.updateProductMulticastGroups(1, multicastGroupDtos)

        then:
        "save() should be called"
        1 * productResource.productRepository.findById(1) >> Optional.of(p)
        1 * productResource.productRepository.save({ Product product ->
            product.getId() == 1L && product.getName() == "US Data" &&
                    product.getMulticastGroups().size() != 0
        }) >> new Product(1L, "US Data", multicastGroups)

        and:
        "findByAutoAssign can be called"
        (0..1) * productResource.multicastGroupRepository.findByAutoAssign(true) >>
                [heartbeat]

        and:
        "Correct result should be returned"
        result instanceof Collection<MulticastGroupDto>
        (result[0].getId() == multicastGroupDtos.get(0).getId() && result[1].getId() == heartbeat.getId()) ||
                (result[1].getId() == multicastGroupDtos.get(0).getId() && result[0].getId() == heartbeat.getId())

        (result[0].getName() == multicastGroupDtos.get(0).getName() && result[1].getName() == heartbeat.getName()) ||
                (result[1].getName() == multicastGroupDtos.get(0).getName() && result[0].getName() == heartbeat.getName())

        (result[0].getPort() == multicastGroupDtos.get(0).getPort() && result[1].getPort() == heartbeat.getPort()) ||
                (result[1].getPort() == multicastGroupDtos.get(0).getPort() && result[0].getPort() == heartbeat.getPort())

        (result[0].getIp() == multicastGroupDtos.get(0).getIp() && result[1].getIp() == heartbeat.getIp()) ||
                (result[1].getIp() == multicastGroupDtos.get(0).getIp() && result[0].getIp() == heartbeat.getIp())
    }

    void "updateProductMulticastGroups() should throw an exception when invalid ID" () {
        when:
        "updateProductMulticastGroups() with invalid ID is called"
        def result = productResource.updateProductMulticastGroups(-1, multicastGroupDtos)

        then:
        "findById() should be called"
        1 * productResource.productRepository.findById(-1) >> Optional.empty()

        and:
        "Exception is thrown"
        thrown(ResponseStatusException)
    }
}
