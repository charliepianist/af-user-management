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
@Constraint(validatedBy = ClientTypeValidator.class)
public @interface ClientType {
    String message() default "Client type can only be 'c', 'r', or 'a'";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}
