package com.mni.api

import com.mni.model.Person
import com.mni.model.PersonRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Shared
import spock.lang.Specification

/**
 * Created by will.schick on 6/17/19.
 */
class PersonResourceSpec extends Specification {

    PersonResource personResource;
    @Shared String longName = "NameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLongNameIsTooLong"
    @Shared String validName = "Valid Name"
    @Shared String longUserId = "UserIDIsTooLongUserIDIsTooLongUserIDIsTooLongUserIDIsTooLongUserIDIsTooLongUserIDIsTooLongUserIDIsTooLongUserIDIsTooLong"
    @Shared String validUser = "Valid UserID"
    @Shared String longPass = "ReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPasswordReallyLongPassword"
    @Shared String shortPass = "shortpass"
    @Shared String validPass = "validPassword1122334455"

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

    void "getPerson() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getPerson() is called with an invalid ID"
        def result = personResource.getPerson(-1)

        then:
        "personRepository should call findById(-1), which will return an empty Optional object"
        1 * personResource.personRepository.findById(-1) >> Optional.empty()

        and:
        "The result from getPerson() should be null"
        thrown(ResponseStatusException)
        result == null
    }

    void "savePerson() with a new userID should return a new persisted person" () {
        when:
        "savePerson() is called with a valid new ID"
        def result = personResource.savePerson(new PersonDto(null, "Bank", "bankUserID", "abcdefghijklmno"))

        then:
        "personRepository should call save, returning the saved Person object"
        1 * personResource.personRepository.save({Person person ->
                                                                    person.getName() == "Bank" &&
                                                                    person.getUserId() == "bankUserID" &&
                                                                    person.getPassword() == "abcdefghijklmno"
                                                        }) >>
                new Person(120, "Bank", "bankUserID", "abcdefghijklmno")

        and:
        "Returned person should be the persisted PersonDto object"
        result instanceof PersonDto
        result.getId() == 120L
        result.getName() == "Bank"
        result.getUserId() == "bankUserID"
        result.getPassword() == "abcdefghijklmno"
    }

    void "listPeople() should return the current people" () {
        given:
        def people = new PageImpl([
                new Person(1, "Person 1", "person1", "password1"),
                new Person(2, "Person 2", "person2", "password2")
        ])

        when:
        "listPeople() is called"
        def result = personResource.listPeople(0, 20, "id", true).getContent()

        then:
        "Call findAll(), returning list of people"
        1 * personResource.personRepository.findAll(_) >> people

        and:
        "Correct people are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getName() == "Person 1"
        result[0].getUserId() == "person1"
        result[0].getPassword() == "password1"

        result[1].getId() == 2L
        result[1].getName() == "Person 2"
        result[1].getUserId() == "person2"
        result[1].getPassword() == "password2"
    }

    void "listPeople() should use default parameters given invalid parameters" () {
        given:
        def people = new PageImpl([
                new Person(1, "Person 1", "person1", "password1"),
                new Person(2, "Person 2", "person2", "password2")
        ])

        when:
        "listPeople() is given invalid parameters"
        personResource.listPeople(-1, -1, "NOT A SORT FIELD", false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * personResource.personRepository.findAll({ Pageable pageRequest ->
                    pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == PersonResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == PersonResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            PersonResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }) >> people
    }

    void "deletePerson(id) should call deleteById() to delete the person" () {
        when:
        "deletePerson(1) is called"
        personResource.deletePerson(1)

        then:
        "deleteById(1) should be called"
        1 * personResource.personRepository.deleteById(1)
    }

    void "updatePerson() should call save() to save person and return new person" () {
        given:
        PersonDto pdto = new PersonDto(1, "New Name", "New UserID", "abcdefghijklmno")

        when:
        "updatePerson() is called"
        def result = personResource.updatePerson(1, pdto)

        then:
        "save() should be called"
        1 * personResource.personRepository.save({Person person ->
                                                                    person.getId() == 1L &&
                                                                    person.getName() == "New Name" &&
                                                                    person.getUserId() == "New UserID" &&
                                                                    person.getPassword() == "abcdefghijklmno"
        }) >> new Person(1L, "New Name", "New UserID", "abcdefghijklmno")

        and:
        "Correct result should be returned"
        result instanceof PersonDto
        result.getId() == pdto.getId()
        result.getPassword() == pdto.getPassword()
        result.getName() == pdto.getName()
        result.getUserId() == pdto.getUserId()
    }
}
