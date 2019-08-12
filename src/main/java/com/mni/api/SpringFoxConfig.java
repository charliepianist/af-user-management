package com.mni.api;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@Configuration
@EnableSwagger2
@Import(BeanValidatorPluginsConfiguration.class)
public class SpringFoxConfig {
    @Bean
    public Docket apiDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.mni"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(getApiInfo());
    }

    private ApiInfo getApiInfo() {
        return new ApiInfo(
                "AlphaFlash User Management API Documentation",
                "Rest API Endpoints for AlphaFlash User Management. Has CRUD operations " +
                        "with pagination for Customers, Products, Locations, and Multicast Groups.\n" +
                        "See also:\n" +
                        "- [Spring: Page Interface](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Page.html)",
                "1.0",
                "",
                new Contact("Charles Liu","","cl43@princeton.edu"),
                "",
                "",
                Collections.emptyList()
        );
    }

    @ApiModel
    public class ExampleMulticastConfig {
        @ApiModelProperty(value="Documentation notes (NOT PART OF RESPONSE)",
                example="NOTE: The actual response to this method is the raw string " +
                        "labeled as response, with text/plain Content-Type.")
        String docNotes;

        @ApiModelProperty(value="multicastconfig.txt raw response",
                example="Group_HEARTBEAT\t192.168.1.4:1004\tE\n" +
                        "Group_TEST_THREE\t192.168.1.3:1003\tE\n" +
                        "Group_TEST_TWO\t192.168.1.2:1002\tE")
        String response;

        public String getDocNotes() {
            return docNotes;
        }

        public void setDocNotes(String docNotes) {
            this.docNotes = docNotes;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
    }

    @ApiModel
    public class ExampleUserConfig {
        @ApiModelProperty(value="Documentation notes (NOT PART OF RESPONSE)",
                example="NOTE: The actual response to this method is the raw string " +
                        "labeled as response, with text/plain Content-Type.")
        String docNotes;

        @ApiModelProperty(value="userconfig.txt raw response",
                example="acme\ta@e!E2r39#rErB$\tc\t2\t1\tGroup_HEARTBEAT,Group_TEST_ONE,Group_TEST_THREE\n" +
                        "bofa\tb@e!E2r39#rErB$\tc\t2\t1\tGroup_HEARTBEAT,Group_TEST_ONE,Group_TEST_THREE\n" +
                        "comcast\tc@e!E2r39#rErB$\tc\t3\t1\tGroup_HEARTBEAT,Group_TEST_ONE,Group_TEST_THREE\n" +
                        "dell\td@e!E2r39#rErB$\tc\t2\t1\tGroup_HEARTBEAT,Group_TEST_ONE,Group_TEST_THREE")
        String response;

        public String getDocNotes() {
            return docNotes;
        }

        public void setDocNotes(String docNotes) {
            this.docNotes = docNotes;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
    }
}