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
@Constraint(validatedBy = PasswordValidator.class)
public @interface Password {
    String message() default "Invalid Password";
    boolean lowercase() default true;
    boolean uppercase() default true;
    boolean number() default true;
    boolean special() default true;
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}
