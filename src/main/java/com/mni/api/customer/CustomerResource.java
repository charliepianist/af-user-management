package com.mni.api.customer;

import com.mni.api.customer.CustomerDto;
import com.mni.model.customer.Customer;
import com.mni.model.customer.CustomerRepository;
import com.mni.model.entitlement.Entitlement;
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
 * Created by will.schick on 6/17/19.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerResource {

    @Autowired
    private CustomerRepository customerRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "name";

    // Translates Customer object to CustomerDto object
    private CustomerDto translateCustomerToCustomerDto(Customer customer){
        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(customer.getId());
        customerDto.setName(customer.getName());
        customerDto.setUserId(customer.getUserId());
        customerDto.setPassword(customer.getPassword());
        customerDto.setEntitlements(customer.getEntitlements());
        return customerDto;
    }

    // Translates CustomerDto object to Customer object
    private Customer translateCustomerDtoToCustomer(CustomerDto customerDto) {
        Customer customer = new Customer();
        customer.setId(customerDto.getId());
        customer.setName(customerDto.getName());
        customer.setUserId(customerDto.getUserId());
        customer.setPassword(customerDto.getPassword());
        customer.setEntitlements(customerDto.getEntitlements());
        return customer;
    }

    // Returns whether a String is a field of Customer
    private boolean isCustomerField(String field) {
        return field.equals("id") || field.equals("name") || field.equals("userId") ||
                field.equals("password");
    }

    //Attempt to save a customer, returns HTTP 400 Bad Request if something goes wrong
    private Customer trySaveCustomer(Customer customer) {
        try{
            customer.getEntitlements().forEach((Entitlement e) -> {
                e.setClient(customer);
            });
            return customerRepository.save(customer);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException)
                // This happens when unique index or primary key violation occurs
                // or invalid data
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name or UserID already taken");

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for new customer");
        }
    }

    @GetMapping
    public Page<CustomerDto> listCustomers(@RequestParam(value="page", defaultValue="0") int page,
                                           @RequestParam(value="size", defaultValue=DEFAULT_PAGE_SIZE + "")
                                              int size,
                                           @RequestParam(value="sortBy", defaultValue=DEFAULT_SORT_FIELD)
                                                  String sortBy,
                                           @RequestParam(value="desc", defaultValue="false") boolean desc
    ){
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isCustomerField(sortBy)) sortBy = DEFAULT_SORT_FIELD;

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        if(!order.equals("password")) order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);

        return customerRepository
                .findAll(pageRequest)
                .map(this::translateCustomerToCustomerDto);
    }


    @GetMapping("{id}")
    public CustomerDto getCustomer(@PathVariable("id") Long id){
        Optional<Customer> customer = customerRepository.findById(id);

        if(!customer.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        return translateCustomerToCustomerDto(customer.get()); //Valid ID
    }

    @PostMapping
    public CustomerDto saveCustomer(@Valid @RequestBody CustomerDto customerDto) {
        Customer inputCustomer = translateCustomerDtoToCustomer(customerDto);
        inputCustomer.setId(null); // ID should be autogenerated

        return translateCustomerToCustomerDto(trySaveCustomer(inputCustomer));
    }

    @PutMapping("{id}")
    public CustomerDto updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto customerDto) {
        Customer inputCustomer = translateCustomerDtoToCustomer(customerDto);
        inputCustomer.setId(id);

        return translateCustomerToCustomerDto(trySaveCustomer(inputCustomer));
    }

    @DeleteMapping("{id}")
    public void deleteCustomer(@PathVariable Long id) {
        try {
            customerRepository.deleteById(id);
        }catch(EmptyResultDataAccessException e) {
            // Customer with ID id does not exist
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
