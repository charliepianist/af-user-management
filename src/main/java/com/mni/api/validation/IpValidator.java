package com.mni.api.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class IpValidator implements ConstraintValidator<Ip, String> {

    private static final Logger logger = LoggerFactory.getLogger(IpValidator.class);

    @Override
    public boolean isValid(String ip, ConstraintValidatorContext constraintValidatorContext) {
        if(ip == null) return false;

        // 4 numbers of length 1 to 3, separated by dots
        if(!ip.matches("([0-9]{1,3}\\.){3}[0-9]{1,3}")) {
            logger.warn("Multicast Group creation/update attempted with IP that is not 4 numbers" +
                    " of length 1 to 3 digits, separated by dots (should not be possible using UI). " +
                    "Attempted IP: \"" + ip + "\"");
            return false;
        }

        // No leading zeroes, no number greater than 255
        String[] nums = ip.split("\\.");
        for(int i = 0; i < nums.length; i++) {
            String numStr = nums[i];
            if(numStr.charAt(0) == '0' && numStr.length() > 1) {
                logger.warn("Multicast Group creation/update attempted with IP with leading zero(es)" +
                        " (should not be possible using UI). Attempted IP: \"" + ip + "\"");
                return false;
            }
            int num = Integer.parseInt(numStr);
            if(num > 255) {
                logger.warn("Multicast Group creation/update attempted with IP with a number greater " +
                        "than 255 (should not be possible using UI). Attempted IP: \"" + ip + "\"");
                return false;
            }
        }

        return true;
    }
}