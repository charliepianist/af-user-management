package com.mni.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class NoSpacesValidator implements ConstraintValidator<NoSpaces, String> {

    private static final Logger logger = LoggerFactory.getLogger(NoSpacesValidator.class);

    @Override
    public void initialize(NoSpaces noSpaces) {

    }

    @Override
    public boolean isValid(String code, ConstraintValidatorContext constraintValidatorContext) {
        if(code == null) return true;
        if(code.matches(".*\\s.*")) {
            logger.warn("Space found in @NoSpaces-annotated field (received: " + code +
                    "): " + constraintValidatorContext.getDefaultConstraintMessageTemplate());
            return false;
        }else return true;
    }
}