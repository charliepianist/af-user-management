package com.mni;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import com.mni.model.Product;
import com.mni.model.ProductRepository;
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
    @Autowired
    ProductRepository productRepository;

    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner startup(){
        return strings -> {
            personRepository.save(new Person(null, "ACME", "a_user", "a%Fe23_fERF9dzV"));
            personRepository.save(new Person(null, "Bank of America", "bofa", "b%23fi_3Fcfv)[e"));
            personRepository.save(new Person(null, "Comcast", "com_user", "c54ENj!ogE4Me4!"));
            personRepository.save(new Person(null, "Dell", "dell_userID", "d9@dl)p2kNM5J!d"));
            productRepository.save(new Product(null, "Department of Energy Data"));
            productRepository.save(new Product(null, "US Data"));
            productRepository.save(new Product(null, "EU Data"));
            productRepository.save(new Product(null, "AU Data"));

            new ProcessBuilder()
                    .directory(new File("ui"))
                    .command("npm","install")
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .start()
                    .waitFor();

            new ProcessBuilder()
                    .directory(new File("ui"))
                    .command("ng","serve","--proxy-config","proxy.conf.json")
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .start();

        };
    }
}
