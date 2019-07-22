package com.mni.api

import com.mni.api.customer.CustomerDto
import com.mni.api.customer.CustomerResource
import com.mni.api.entitlement.EntitlementDto
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
    @Shared ArrayList<EntitlementDto> entitlementDtos

    void setupSpec() {
        entitlements = new ArrayList<>()
        entitlements.add(new Entitlement(1, null, null, null))
        entitlementDtos = EntitlementDto.entitlementsToEntitlementDtos(entitlements)
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
                new Customer(1, "ACME", "acme", "a3lK9n12!_", entitlements)
        )

        and:
        "The customer returned by getCustomer() should be the same as the customer given by the repository"
        result instanceof CustomerDto
        result.getId() == 1L
        result.getName() == "ACME"
        result.getUserId() == "acme"
        result.getPassword() == "a3lK9n12!_"
    }

    void "getCustomer() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getCustomer() is called with an invalid ID"
        def result = customerResource.getCustomer(-1)

        then:
        "customerRepository should call findById(-1), which will return an empty Optional object"
        1 * customerResource.customerRepository.findById(-1) >> Optional.empty()

        and:
        "Exception should be thrown"
        thrown(ResponseStatusException)
    }

    void "getCustomerEntitlements() should return correct entitlements when called with valid ID" () {
        when:
        "getCustomerEntitlements() is called"
        def result = customerResource.getCustomerEntitlements(1)

        then:
        "customerRepository should call findById(1), which will return a Customer object"
        1 * customerResource.customerRepository.findById(1) >> Optional.of(
                new Customer(1, "ACME", "acme", "a3lK9n12!_", entitlements)
        )

        and:
        "result should be the correct set of entitlements"
        result instanceof Collection<EntitlementDto>
        result[0].getId() == entitlementDtos.get(0).getId()
        result[0].getProduct() == entitlementDtos.get(0).getProduct()
        result[0].getLocation() == entitlementDtos.get(0).getLocation()
        result[0].getClient() == entitlementDtos.get(0).getClient()
        result[0].getExpirationDate() == entitlementDtos.get(0).getExpirationDate()
    }

    void "getCustomerEntitlements() should throw exception given invalid ID" () {
        when:
        "getCustomerEntitlements() is called"
        def result = customerResource.getCustomerEntitlements(1)

        then:
        "customerRepository should call findById(1), which will return an empty Customer optional"
        1 * customerResource.customerRepository.findById(1) >> Optional.empty()

        and:
        "Exception should be thrown"
        thrown(ResponseStatusException)
    }

    void "saveCustomer() with a new userID should return a new persisted customer" () {
        when:
        "saveCustomer() is called with a valid new ID"
        def result = customerResource.saveCustomer(new CustomerDto(null, "Bank",
                "bankUserID", "abcdefghijklmno"))

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
    }

    void "listCustomers() should return the current customers" () {
        given:
        def customers = new PageImpl([
                new Customer(1, "Customer 1", "customer1", "password1", entitlements),
                new Customer(2, "Customer 2", "customer2", "password2", entitlements)
        ])

        when:
        "listCustomers() is called"
        def result = customerResource.listCustomers(0, 20, "id", true, true).getContent()

        then:
        "Call findAll(), returning list of customers"
        1 * customerResource.customerRepository.findByDisabled(_, true) >> customers

        and:
        "Correct customers are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getName() == "Customer 1"
        result[0].getUserId() == "customer1"
        result[0].getPassword() == "password1"

        result[1].getId() == 2L
        result[1].getName() == "Customer 2"
        result[1].getUserId() == "customer2"
        result[1].getPassword() == "password2"
    }

    void "listCustomers() should use default parameters given invalid parameters" () {
        given:
        def customers = new PageImpl([
                new Customer(1, "Customer 1", "customer1", "password1", entitlements),
                new Customer(2, "Customer 2", "customer2", "password2", entitlements)
        ])

        when:
        "listCustomers() is given invalid parameters"
        customerResource.listCustomers(-1, -1, "NOT A SORT FIELD", false, false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * customerResource.customerRepository.findByDisabled({ Pageable pageRequest ->
                    pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == CustomerResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == CustomerResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            CustomerResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }, false) >> customers
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
        Customer c = new Customer(1, "Name", "UserID", "password", entitlements)
        CustomerDto customerDto = new CustomerDto(1, "New Name", "New UserID", "abcdefghijklmno")

        when:
        "updateCustomer() is called"
        customerDto.setDisabled(true)
        def result = customerResource.updateCustomer(1, customerDto)

        then:
        "should get old customer and save() should be called"
        1 * customerResource.customerRepository.findById(1) >> Optional.of(c)
        1 * customerResource.customerRepository.save({ Customer customer ->
                                                                    customer.getId() == 1L &&
                                                                    customer.getName() == "New Name" &&
                                                                    customer.getUserId() == "New UserID" &&
                                                                    customer.getPassword() == "abcdefghijklmno"
                                                                    customer.isDisabled() == true
        }) >> new Customer(1L, "New Name", "New UserID", "abcdefghijklmno", entitlements, true)

        and:
        "Correct result should be returned"
        result instanceof CustomerDto
        result.getId() == customerDto.getId()
        result.getPassword() == customerDto.getPassword()
        result.getName() == customerDto.getName()
        result.getUserId() == customerDto.getUserId()
        result.isDisabled() == customerDto.isDisabled()
    }

    void "updateCustomerEntitlements() should call save() and return updated customer" () {
        given:
        Customer c = new Customer(1L, "New Name", "New UserID", "abcdefghijklmno", new ArrayList())

        when:
        "updateCustomerEntitlements() is called"
        def result = customerResource.updateCustomerEntitlements(1, entitlementDtos)

        then:
        "save() should be called"
        1 * customerResource.customerRepository.findById(1) >> Optional.of(c)
        1 * customerResource.customerRepository.save({ Customer customer ->
            customer.getId() == 1L &&
                    customer.getName() == "New Name" &&
                    customer.getUserId() == "New UserID" &&
                    customer.getPassword() == "abcdefghijklmno" &&
                    customer.getEntitlements().size() != 0 &&
                    customer.getEntitlements()[0].getClient() == c
        }) >> new Customer(1L, "New Name", "New UserID", "abcdefghijklmno", entitlements)

        and:
        "Correct result should be returned"
        result instanceof Collection<EntitlementDto>
        result[0].getId() == entitlementDtos.get(0).getId()
        result[0].getProduct() == entitlementDtos.get(0).getProduct()
        result[0].getLocation() == entitlementDtos.get(0).getLocation()
        result[0].getClient() == entitlementDtos.get(0).getClient()
        result[0].getExpirationDate() == entitlementDtos.get(0).getExpirationDate()
    }

    void "updateCustomerEntitlements() should throw an exception when invalid ID" () {
        when:
        "updateCustomerEntitlements() with invalid ID is called"
        def result = customerResource.updateCustomerEntitlements(1, entitlementDtos)

        then:
        "findById() should be called"
        1 * customerResource.customerRepository.findById(1) >> Optional.empty()

        and:
        "Exception is thrown"
        thrown(ResponseStatusException)
    }
}
