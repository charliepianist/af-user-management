# AF User Management
Updated August 2019 (initial version of the application)
## Configuring and Running

### Configuration

###### [Application.java](src/main/java/com/mni/Application.java) - Startup and Data configuration
* startup() contains the code run on startup.
    * initTestData() generates test data for an 
    in-memory H2 database and should be
    replaced with connecting to a real database.
    * The ProcessBuilders create a proxy for the Angular application
    and should be removed in production.
    
###### [WebSecurityConfig.java](src/main/java/com/mni/api/auth/WebSecurityConfig.java) - Security configuration
* The first configure() method creates in-memory
username/password combinations, and should be replaced
with connecting to a database.
* The second configure() method defines the login/logout
configurations, as well as the role permissions for
various pages.
    * Currently, the login page is taken from
    [login.html](src/main/resources/static/login.html).

###### Software Version
* [Angular](https://cli.angular.io/) CLI 8.0.3
* [NodeJS](https://nodejs.org/en/) 10.16.0

###### Logging
* slf4j Loggers are used throughout the application, and
need to be configured to connect to a file logging system.

### Running
1. Build the Angular application and save the compiled HTML/CSS/JS code in 
the [static](src/main/resources/static) directory 
(build script in [package.json](ui/package.json)
was used for this purpose in development).
2. Run Application.java.

## REST API

* API Documentation can be found at /swagger-ui.html#
when running the application (e.g. 
localhost:8080/swagger-ui.html#/).
* Configuration for generating documentation is in
[SpringFoxConfig.java](src/main/java/com/mni/api/SpringFoxConfig.java).
    * apiDocket() contains configurations for what
    to include in generated documentation.
    * getApiInfo() has descriptions to be displayed
    on the documentation page.
    * Example Classes are in this
    class for describing this application's
    responses. If application is updated, these classes may
    require updating. Potential changes include:
        * Different format for [MulticastConfigResource.java](src/main/java/com/mni/api/config/MulticastConfigResource.java)
        methods (multicastconfig.txt and userconfig.txt)

## Guide to code

### Design Concerns
* Security
    * The USER role can consume all GET methods in the Rest API, including the endpoints
    for multicast configuration files.
    * <b>In development, a proxy to the Angular application was created at localhost:4200.</b>
    This should be removed in production (and is located in 
    [Application.java](src/main/java/com/mni/Application.java)).
* Field Validation
    * Validation occurs at both the UI and API level.
        * The only exception to this is that <b>Trial end date validation only occurs at the UI level.</b>
        * (Note: Was unable to get Spring to validate the date field of EntitlementDto in the Collection it receives.)
    * For descriptions of the fields, see Rest API Documentation.
* API/Service
    * When updating customers and products, entitlements and multicast groups in the DTO
    objects are respectively ignored, since they entitlements and multicast groups have
    separate endpoints.
    * <b>Trials (entitlements) do not automatically terminate.</b> A user with an expired trial will 
    continue to receive data until the trial is removed.
    * Auto-assigned groups are added to ALL multicastconfig.txt files, regardless of if a Location has
    any entitlements.
    * Auto-assigned groups are added to ALL customers by default in userconfig.txt (which is expected behavior,
    as a customer must be subscribed to a product to be on a userconfig.txt, which implies the presence of the
    auto-assigned groups).
* UI
    * When updating customers, one can update either the customer's information or entitlements,
    not both at the same time (due to updating both not being a transactional operation).
        * The same applies to products and their multicast groups.
    * Services take callback functions as parameters rather than passing Observables around.
    * The CSS Animations used for updating customer entitlements caused a huge increase in memory consumption
    and are commented out.
        * The animation code is in 
        [customer-entitlements.component.css](ui/src/app/routes/customers/customer-entitlements/customer-entitlements.component.css).
        Some methods in
        [customer-entitlements.component.ts](ui/src/app/routes/customers/customer-entitlements/customer-entitlements.component.ts)
        also are named with the words animate/animation but without the commented out code in the CSS file, do 
        not cause animations.
* Logging
    * Customer passwords are obfuscated as a sequence of asterisks with length equal to the length
    of the password. For example, "password" is logged as "********".
    * Warnings are thrown when accessing /swagger-ui.html# (Rest API Documentation) due to
    Spring Fox attempting to use "" as default values for numbers and throwing NumberFormatExceptions.

### Server Side Code

##### Persistence Tier

This is in the [model](src/main/java/com/mni/model) package. It contains JPA entities and 
[Spring Data JPA repositories](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa).
 
##### Service Tier

This is in the [api](src/main/java/com/mni/api) package. It contains Spring @RestControllers and api DTOs,
as well as Spring Fox configurations (for generating Rest API Documentation) and validation classes.

* [auth](src/main/java/com/mni/api/auth) - Security configuration class, rest controller, and User 
DTO object
* [config](src/main/java/com/mni/api/config) - Multicast Configuration Rest Controller
(used by AlphaFlash servers)
* [validation](src/main/java/com/mni/api/validation) - Annotation and Validation classes for 
various input validations
* [SpringFoxConfig.java](src/main/java/com/mni/api/SpringFoxConfig.java) - Configuration
class for Spring Fox, which generates Rest API Documentation using Swagger.

### Client Side Code

The client side code is in the [ui](ui/src/app) directory.

* [components](ui/src/app/components) - Miscellaneous helper components used throughout the
Angular application
* [helper](ui/src/app/helper) - Helper classes used throughout the TypeScript code
* [model](ui/src/app/model) - Client side business objects (with properties and helper methods)
* [routes](ui/src/app/routes) - Routers for the [angular router](https://angular.io/guide/router). They
correspond to pages in the application.
* [services](ui/src/app/services) - Service objects that consume the Rest API provided by the java code and translate it to client side model objects
* [test](ui/src/app/test) - Helper module for ease of writing tests

## Testing

### Spock Tests (.groovy files)

Spock tests for the Rest API Endpoints are found in the [test](src/test) directory.

### Postman Collections (API)

Customers REST API Tests:
https://www.getpostman.com/collections/88805f116b753327ebbf

Products REST API Tests:
https://www.getpostman.com/collections/421b1a07827b20300f6e

Locations REST API Tests:
https://www.getpostman.com/collections/393c1de80460dbf74fed

Multicast Groups REST API Tests:
https://www.getpostman.com/collections/7c9a797413c0caee9f91

API Endpoint Security Tests:
https://www.getpostman.com/collections/e2cd4b12e1b89402a1a0

### Jasmine Tests (for Angular application)

Running 'ng test' from the Angular CLI runs tests for the
angular components and services. The test classes are in the 
*.spec.ts files throughout the [ui](ui/src/app) directory.