package com.mni.api;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({METHOD, FIELD, ANNOTATION_TYPE})
@Constraint(validatedBy = NoSpacesValidator.class)
public @interface NoSpaces {
    String message() default "Code cannot have spaces.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}
