package com.mni.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class ClientTypeValidator implements ConstraintValidator<ClientType, Character> {

    private static final Logger logger = LoggerFactory.getLogger(ClientTypeValidator.class);

    @Override
    public boolean isValid(Character clientType, ConstraintValidatorContext constraintValidatorContext) {
        if(clientType == null) {
            logger.warn("Customer creation was attempted with null clientType (UI should not permit this).");
            return false;
        }

        char charValue = clientType.charValue();
        if(charValue == 'c' || charValue == 'r' || charValue == 'a')
            return true;
        else {
            logger.warn("Customer creation was attempted with clientType other than 'c', 'r', and 'a': " +
                    charValue + " (UI should not permit this).");
            return false;
        }
    }
}