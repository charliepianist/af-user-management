package com.mni.api

import com.mni.model.Person
import com.mni.model.PersonRepository
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

    void "listPeople() should get all people from database, translate them to dtos and return them"(){
        given:
        "some people in the database"
        def people = [
                new Person(1,"joe","bob"),
                new Person(6,"jane","fonda")
        ]

        when:
        "listPeople() is called"
        def result = personResource.listPeople()


        //???
        //what is this? mock method call
        // see http://spockframework.org/spock/docs/1.0/interaction_based_testing.html
        then:
        "the database should queried"
        1 * personResource.personRepository.findAll() >> people


        and:
        "the result should contain the people dtos"
        result.size() == 2
        result[0].id == 1L
        result[0].firstname == "joe"
        result[0].lastname == "bob"

        result[1].id == 6L
        result[1].firstname == "jane"
        result[1].lastname == "fonda"

    }


    void "getPerson() should return a person based on ID"(){

        when:
        "get person is called"
        def result = personResource.getPerson(1234L)

        then:
        "the database should be queried"
        1 * personResource.personRepository.findById(1234L) >> Optional.of(new Person(1234L,"billy","bob"))


        and:
        "the returned dto should have that person"
        result.id == 1234L
        result.firstname == "billy"
        result.lastname == "bob"


    }


    void "getPerson() should throw an illegal argument exception if the person is not found"(){

        when:
        "get person is called"
        def result = personResource.getPerson(1234L)

        then:
        "the database should be queried (and return empty)"
        1 * personResource.personRepository.findById(1234L) >> Optional.empty()


        and:
        "an exception should be thrown"
        thrown(IllegalArgumentException)
    }


    void "savePerson() should persist a person and return the persisted version"(){

        when:
        "a person is saved"
        def result = personResource.savePerson(new PersonDto(null,"billy","jean"))

        then:
        "the person should be saved"
        1 * personResource.personRepository.save({Person person->
                person.firstname == "billy" &&
                person.lastname == "jean"
        }) >> new Person(789L,"billy","jean")

        and:
        "the result should be the saved item"
        result.id == 789L
        result.firstname == "billy"
        result.lastname == "jean"
    }





}
