package com.mni;

import com.mni.model.Customer;
import com.mni.model.CustomerRepository;
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
    CustomerRepository customerRepository;
    @Autowired
    ProductRepository productRepository;

    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner startup(){
        return strings -> {
            customerRepository.save(new Customer(null, "ACME", "a_user", "a%Fe23_fERF9dzV"));
            customerRepository.save(new Customer(null, "Bank of America", "bofa", "b%23fi_3Fcfv)[e"));
            customerRepository.save(new Customer(null, "Comcast", "com_user", "c54ENj!ogE4Me4!"));
            customerRepository.save(new Customer(null, "Dell", "dell_userID", "d9@dl)p2kNM5J!d"));
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
