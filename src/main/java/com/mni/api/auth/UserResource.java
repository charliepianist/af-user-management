package com.mni.api.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/user")
public class UserResource {

    @GetMapping
    public UserDto getUserDto(Authentication authentication) {
        if(authentication == null) return new UserDto();

        ArrayList<String> roles = new ArrayList();
        authentication.getAuthorities().forEach(auth -> {
            roles.add(auth.getAuthority());
        });
        return new UserDto(roles);
    }

}
