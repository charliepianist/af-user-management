package com.mni.api.auth;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/user")
@Api("REST API Endpoint to get current session user information")
public class UserResource {

    @GetMapping
    @ApiOperation("Returns a UserDto object representing the current session's user." +
            "\nAs of initial version, returns just the roles of the current session's user.")
    public UserDto getUserDto(@ApiParam("Authentication info (provided by Spring Security).")
                                          Authentication authentication) {
        if(authentication == null) return new UserDto();

        ArrayList<String> roles = new ArrayList();
        authentication.getAuthorities().forEach(auth -> {
            roles.add(auth.getAuthority());
        });
        return new UserDto(roles);
    }

}
