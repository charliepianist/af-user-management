# AF User Management

## Postman Links

#### People REST API Tests

https://www.getpostman.com/collections/88805f116b753327ebbf

#### Products REST API Tests

https://www.getpostman.com/collections/fb3ff7855b4025e54de4


## Guide to code


### Server Side Code


#### Persistence Tier

This is in the [model](src/main/java/com/mni/model) package. It contains JPA entities and 
[Spring Data JPA repositories](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa).
 
#### Service Tier

This is in the [api](src/main/java/com/mni/api) package. It contains Spring @RestControllers and api DTOs.

### Client Side Code

The client side code is in the [ui](ui/src/app) directory.

#### Client Side Model

These are client side business objects. They are in the [model](ui/src/app/model) directory. 

#### Client Side Services

These service objects consume the rest api provided by the java code and translate it to client side model objects. 
They are in [services](ui/src/app/services)

#### Client side "routes"

These are routers for [angular router](https://angular.io/guide/router). They correspond to different "pages" in the app. 
They are in [routes](ui/src/app/routes).



