package com.mni.api.auth;

import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.Collection;

@ApiModel(description="DTO representing current user's session. As of initial version, only" +
        " contains a collection of strings representing the user's roles and is only sent " +
        "via response to GET call from users. Possible roles" +
        " are ROLE_USER and ROLE_ADMIN, with an empty collection meaning the user has " +
        "not yet logged in.")
public class UserDto {
    Collection<String> roles = new ArrayList();

    public UserDto() {

    }
    public UserDto(Collection<String> roles) {
        this.roles = roles;
    }

    public Collection<String> getRoles() {
        return roles;
    }

    public void setRoles(Collection<String> roles) {
        this.roles = roles;
    }
}
