package com.mni;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;

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
            personRepository.save(new Person());
            personRepository.save(new Person());

            new ProcessBuilder()
                    .directory(new File("ui"))
                    .command("ng","serve","--proxy-config","proxy.conf.json")
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .start();

        };
    }
}
