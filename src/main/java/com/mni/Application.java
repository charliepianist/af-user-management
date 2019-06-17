package com.mni;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Created by will.schick on 6/17/19.
 */
@SpringBootApplication
public class Application {

    @Autowired
    PersonRepository personRepository;

    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner startup(){
        return strings -> {
            personRepository.save(new Person("joe","bob"));
            personRepository.save(new Person("billy","bob"));
        };
    }
}
