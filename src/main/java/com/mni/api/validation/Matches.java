package com.mni.api.validation;

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
@Constraint(validatedBy = MatchesValidator.class)
public @interface Matches {
    String message() default "Invalid Password";
    String value();
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}
