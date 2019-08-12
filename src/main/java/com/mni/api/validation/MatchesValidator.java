package com.mni.api.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class MatchesValidator implements ConstraintValidator<Matches, String> {

    private static final Logger logger = LoggerFactory.getLogger(MatchesValidator.class);

    private String regex;

    private Matches matches;
    @Override
    public void initialize(Matches matches) {
        this.regex = matches.value();
        this.matches = matches;
    }

    @Override
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        if(str == null) return false;
        if(!str.matches(regex)) {
            logger.warn("Field annotated with @Matches(\"" + regex + "\") does not match. " +
                    "Attempted value: \"" + str + "\"");
            return false;
        }
        return true;
    }
}