package com.mni.api

import com.mni.api.customer.CustomerDto
import com.mni.api.customer.CustomerResource
import com.mni.model.customer.Customer
import com.mni.model.customer.CustomerRepository
import com.mni.model.entitlement.Entitlement
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Shared
import spock.lang.Specification

/**
 * Created by will.schick on 6/17/19.
 */
class CustomerResourceSpec extends Specification {

    CustomerResource customerResource
    @Shared ArrayList<Entitlement> entitlements

    void setupSpec() {
        entitlements = new ArrayList<>();
        entitlements.add(new Entitlement(1, null, null, null))
    }

    void setup(){
        customerResource = new CustomerResource()
        customerResource.customerRepository = Mock(CustomerRepository)
    }

    void "getCustomer() should return a CustomerDto object when called with a valid ID" () {
        when:
        "getCustomer(1) is called"
        def result = customerResource.getCustomer(1)

        then:
        "customerRepository should call findById(1), which will return a Customer object"
        1 * customerResource.customerRepository.findById(1) >> Optional.of(
                new Customer(1, "ACME", "acme", "a3lK9n12!_", entitlements))
        and:
        "The customer returned by getCustomer() should be the same as the customer given by the repository"
        result instanceof CustomerDto
        result.getId() == 1L
        result.getName() == "ACME"
        result.getUserId() == "acme"
        result.getPassword() == "a3lK9n12!_"
        result.getEntitlements() == entitlements
    }

    void "getCustomer() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getCustomer() is called with an invalid ID"
        def result = customerResource.getCustomer(-1)

        then:
        "customerRepository should call findById(-1), which will return an empty Optional object"
        1 * customerResource.customerRepository.findById(-1) >> Optional.empty()

        and:
        "The result from getCustomer() should be null"
        thrown(ResponseStatusException)
        result == null
    }

    void "saveCustomer() with a new userID should return a new persisted customer" () {
        when:
        "saveCustomer() is called with a valid new ID"
        def result = customerResource.saveCustomer(new CustomerDto(null, "Bank",
                "bankUserID", "abcdefghijklmno", entitlements))

        then:
        "customerRepository should call save, returning the saved Customer object"
        1 * customerResource.customerRepository.save({ Customer customer ->
                                                                    customer.getName() == "Bank" &&
                                                                    customer.getUserId() == "bankUserID" &&
                                                                    customer.getPassword() == "abcdefghijklmno"
                                                        }) >>
                new Customer(120, "Bank", "bankUserID", "abcdefghijklmno", entitlements)

        and:
        "Returned customer should be the persisted CustomerDto object"
        result instanceof CustomerDto
        result.getId() == 120L
        result.getName() == "Bank"
        result.getUserId() == "bankUserID"
        result.getPassword() == "abcdefghijklmno"
        result.getEntitlements() == entitlements
    }

    void "listCustomers() should return the current customers" () {
        given:
        def customers = new PageImpl([
                new Customer(1, "Customer 1", "customer1", "password1", entitlements),
                new Customer(2, "Customer 2", "customer2", "password2", entitlements)
        ])

        when:
        "listCustomers() is called"
        def result = customerResource.listCustomers(0, 20, "id", true).getContent()

        then:
        "Call findAll(), returning list of customers"
        1 * customerResource.customerRepository.findAll(_) >> customers

        and:
        "Correct customers are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getName() == "Customer 1"
        result[0].getUserId() == "customer1"
        result[0].getPassword() == "password1"
        result[0].getEntitlements() == entitlements

        result[1].getId() == 2L
        result[1].getName() == "Customer 2"
        result[1].getUserId() == "customer2"
        result[1].getPassword() == "password2"
        result[1].getEntitlements() == entitlements
    }

    void "listCustomers() should use default parameters given invalid parameters" () {
        given:
        def customers = new PageImpl([
                new Customer(1, "Customer 1", "customer1", "password1", entitlements),
                new Customer(2, "Customer 2", "customer2", "password2", entitlements)
        ])

        when:
        "listCustomers() is given invalid parameters"
        customerResource.listCustomers(-1, -1, "NOT A SORT FIELD", false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * customerResource.customerRepository.findAll({ Pageable pageRequest ->
                    pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == CustomerResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == CustomerResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            CustomerResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }) >> customers
    }

    void "deleteCustomer(id) should call deleteById() to delete the customer" () {
        when:
        "deleteCustomer(1) is called"
        customerResource.deleteCustomer(1)

        then:
        "deleteById(1) should be called"
        1 * customerResource.customerRepository.deleteById(1)
    }

    void "updateCustomer() should call save() to save customer and return new customer" () {
        given:
        CustomerDto customerDto = new CustomerDto(1, "New Name", "New UserID", "abcdefghijklmno", entitlements)

        when:
        "updateCustomer() is called"
        def result = customerResource.updateCustomer(1, customerDto)

        then:
        "save() should be called"
        1 * customerResource.customerRepository.save({ Customer customer ->
                                                                    customer.getId() == 1L &&
                                                                    customer.getName() == "New Name" &&
                                                                    customer.getUserId() == "New UserID" &&
                                                                    customer.getPassword() == "abcdefghijklmno" &&
                                                                    customer.getEntitlements() == entitlements
        }) >> new Customer(1L, "New Name", "New UserID", "abcdefghijklmno", entitlements)

        and:
        "Correct result should be returned"
        result instanceof CustomerDto
        result.getId() == customerDto.getId()
        result.getPassword() == customerDto.getPassword()
        result.getName() == customerDto.getName()
        result.getUserId() == customerDto.getUserId()
        result.getEntitlements() == entitlements
    }
}
