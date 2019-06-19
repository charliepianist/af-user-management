package com.mni.api

import com.mni.model.Person
import com.mni.model.PersonRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import spock.lang.Specification

/**
 * Created by will.schick on 6/17/19.
 */
class PersonResourceSpec extends Specification {


    PersonResource personResource;

    void setup(){
        personResource = new PersonResource()
        personResource.personRepository = Mock(PersonRepository)
    }

    void "getPerson() should return a PersonDto object when called with a valid ID" () {
        when:
        "getPerson(1) is called"
        def result = personResource.getPerson(1);

        then:
        "personRepository should call findById(1), which will return a Person object"
        1 * personResource.personRepository.findById(1) >> Optional.of(
                new Person(1, "ACME", "acme", "a3lK9n12!_"));

        and:
        "The person returned by getPerson() should be the same as the person given by the repository"
        result instanceof PersonDto
        result.getId() == 1L;
        result.getName() == "ACME"
        result.getUserId() == "acme"
        result.getPassword() == "a3lK9n12!_"
    }

    void "getPerson() should return null when called with an invalid ID" () {
        when:
        "getPerson() is called with an invalid ID"
        def result = personResource.getPerson(-1);

        then:
        "personRepository should call findById(-1), which will return an empty Optional object"
        1 * personResource.personRepository.findById(-1) >> Optional.empty();

        and:
        "The result from getPerson() should be null"
        result == null
    }

    void "savePerson() with a new userID should return a new persisted person" () {
        when:
        "savePerson() is called with a valid new ID"
        def result = personResource.savePerson(new PersonDto(null, "Bank", "bankUserID", "b9(de!2kfne"))

        then:
        "personRepository should call save, returning the saved Person object"
        1 * personResource.personRepository.save({Person person ->
                                                                    person.getName() == "Bank" &&
                                                                    person.getUserId() == "bankUserID" &&
                                                                    person.getPassword() == "b9(de!2kfne"
                                                        }) >>
                new Person(120, "Bank", "bankUserID", "b9(de!2kfne")

        and:
        "Returned person should be the persisted PersonDto object"
        result instanceof PersonDto
        result.getId() == 120L
        result.getName() == "Bank"
        result.getUserId() == "bankUserID"
        result.getPassword() == "b9(de!2kfne"
    }

    void "listPeople() should return the current people" () {
        given:
        def people = new PageImpl([
                new Person(1, "Person 1", "person1", "password1"),
                new Person(2, "Person 2", "person2", "password2")
        ])
        def pageRequest = PageRequest.of(0, 2)

        when:
        "listPeople() is called"
        def result = personResource.listPeople(pageRequest).getContent()

        then:
        "Call findAll(), returning list of people"
        1 * personResource.personRepository.findAll(pageRequest) >> people

        and:
        "Correct people are returned"
        result.size() == 2

        result[0].id == 1L
        result[0].name == "Person 1"
        result[0].userId == "person1"
        result[0].password == "password1"

        result[1].id == 2L
        result[1].name == "Person 2"
        result[1].userId == "person2"
        result[1].password == "password2"
    }

    void "deletePerson(id) should call deleteById() to delete the person" () {
        when:
        "deletePerson(1) is called"
        personResource.deletePerson(1)

        then:
        "deleteById(1) should be called"
        1 * personResource.personRepository.deleteById(1)
    }
}
