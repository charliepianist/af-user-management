package com.mni.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class PasswordValidator implements ConstraintValidator<Password, String> {

    private static final Logger logger = LoggerFactory.getLogger(PasswordValidator.class);

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
            if(!password.matches(".*[a-z].*")) {
                logger.warn("Customer creation with password " + password + " (no lowercase letter) attempted " +
                        "(should not be possible using UI).");
                return false;
            }
        }
        if(uppercase) {
            if(!password.matches(".*[A-Z].*")) {
                logger.warn("Customer creation with password " + password + " (no uppercase letter) attempted " +
                        "(should not be possible using UI).");
                return false;
            }
        }
        if(number) {
            if(!password.matches(".*[0-9].*")) {
                logger.warn("Customer creation with password " + password + " (no number) attempted " +
                        "(should not be possible using UI).");
                return false;
            }
        }
        if(special) {
            if(!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
                logger.warn("Customer creation with password " + password + " (no special character) attempted " +
                        "(should not be possible using UI).");
                return false;
            }
        }
        return true;
    }
}