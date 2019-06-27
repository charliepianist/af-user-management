package com.mni.api;

import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class PasswordValidator implements ConstraintValidator<Password, String> {

    private boolean lowercase;
    private boolean uppercase;
    private boolean number;
    private boolean special;

    @Override
    public void initialize(Password password) {
        this.lowercase = password.lowercase();
        this.uppercase = password.uppercase();
        this.number = password.number();
        this.special = password.special();
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext constraintValidatorContext) {
        if(password == null) return false;
        if(lowercase) {
            if(!password.matches(".*[a-z].*"))
                return false;
        }
        if(uppercase) {
            if(!password.matches(".*[A-Z].*"))
                return false;
        }
        if(number) {
            if(!password.matches(".*[0-9].*"))
                return false;
        }
        if(special) {
            if(!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*"))
                return false;
        }
        return true;
    }
}