package com.mni.api.customer;

import com.mni.api.ClientType;
import com.mni.api.Password;
import com.mni.model.customer.Customer;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
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

    @NotNull
    @ClientType
    private Character clientType;

    @NotNull
    @Positive
    private Integer priority;

    private boolean disabled;

    public CustomerDto() {}

    public CustomerDto(Long id, String name, String userId, String password,
                       Character clientType, Integer priority) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
        this.clientType = clientType;
        this.priority = priority;
    }

    public static CustomerDto translateCustomerToCustomerDto(Customer customer){
        if(customer == null) return null;
        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(customer.getId());
        customerDto.setName(customer.getName());
        customerDto.setUserId(customer.getUserId());
        customerDto.setPassword(customer.getPassword());
        customerDto.setClientType(customer.getClientType());
        customerDto.setPriority(customer.getPriority());
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
        customer.setClientType(customerDto.getClientType());
        customer.setPriority(customerDto.getPriority());
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

    public Character getClientType() {
        return clientType;
    }

    public void setClientType(Character clientType) {
        this.clientType = clientType;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        return "CustomerDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", userId='" + userId + '\'' +
                ", password='" + password + '\'' +
                ", clientType=" + clientType +
                ", priority=" + priority +
                ", disabled=" + disabled +
                '}';
    }
}
