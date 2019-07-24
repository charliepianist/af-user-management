package com.mni.api.customer;

import com.mni.api.Password;
import com.mni.model.customer.Customer;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Created by will.schick on 6/17/19.
 */
public class CustomerDto {

    private Long id;

    @NotBlank
    @Size(max = Customer.MAX_NAME_LENGTH, message = "Name cannot be over " +
            Customer.MAX_NAME_LENGTH + " characters long")
    private String name;

    @NotBlank
    @Size(max = Customer.MAX_USERID_LENGTH, message = "User ID cannot be over " +
            Customer.MAX_USERID_LENGTH + " characters long")
    private String userId;

    @NotBlank
    @Size(min = Customer.MIN_PASSWORD_LENGTH, max = Customer.MAX_PASSWORD_LENGTH, message = "Password must" +
            " be between " + Customer.MIN_PASSWORD_LENGTH + " and " + Customer.MAX_PASSWORD_LENGTH +
            " characters long")
    @Password
    private String password;

    private boolean disabled;

    public CustomerDto() {}

    public CustomerDto(Long id, String name, String userId, String password) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
    }

    public static CustomerDto translateCustomerToCustomerDto(Customer customer){
        if(customer == null) return null;
        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(customer.getId());
        customerDto.setName(customer.getName());
        customerDto.setUserId(customer.getUserId());
        customerDto.setPassword(customer.getPassword());
        customerDto.setDisabled(customer.isDisabled());
        return customerDto;
    }

    // Translates CustomerDto object to Customer object
    public static Customer translateCustomerDtoToCustomer(CustomerDto customerDto) {
        if(customerDto == null) return null;
        Customer customer = new Customer();
        customer.setId(customerDto.getId());
        customer.setName(customerDto.getName());
        customer.setUserId(customerDto.getUserId());
        customer.setPassword(customerDto.getPassword());
        customer.setDisabled(customerDto.isDisabled());
        return customer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }
}
