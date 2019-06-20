package com.mni.api;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Null;

/**
 * Created by will.schick on 6/17/19.
 */
public class PersonDto {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String userId;

    @NotBlank
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
