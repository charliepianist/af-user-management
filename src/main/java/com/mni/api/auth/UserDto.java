package com.mni.api.auth;

import java.util.ArrayList;
import java.util.Collection;

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
