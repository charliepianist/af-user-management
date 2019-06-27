package com.mni.api;

import com.mni.model.Person;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Created by will.schick on 6/17/19.
 */
public class PersonDto {

    private Long id;

    @NotBlank
    @Size(max = Person.MAX_NAME_LENGTH, message = "Name cannot be over " +
            Person.MAX_NAME_LENGTH + " characters long")
    private String name;

    @NotBlank
    @Size(max = Person.MAX_USERID_LENGTH, message = "User ID cannot be over " +
            Person.MAX_USERID_LENGTH + " characters long")
    private String userId;

    @NotBlank
    @Size(min = Person.MIN_PASSWORD_LENGTH, max = Person.MAX_PASSWORD_LENGTH, message = "Password must" +
            " be between " + Person.MIN_PASSWORD_LENGTH + " and " + Person.MAX_PASSWORD_LENGTH +
            " characters long")
    @Password
    private String password;

    public PersonDto(Long id, String name, String userId, String password) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
    }

    public PersonDto() {}

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
}
