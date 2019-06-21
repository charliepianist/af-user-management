package com.mni.api;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException;
import org.omg.CORBA.DynAnyPackage.Invalid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Created by will.schick on 6/17/19.
 */
@RestController
@RequestMapping("/api/people")
public class PersonResource {


    @Autowired
    PersonRepository personRepository;

    // Translates Person object to PersonDto object
    private PersonDto translatePersonToPersonDto(Person person){
        PersonDto personDto = new PersonDto();
        personDto.setId(person.getId());
        personDto.setName(person.getName());
        personDto.setUserId(person.getUserId());
        personDto.setPassword(person.getPassword());
        return personDto;
    }

    // Translates PersonDto object to Person object
    private Person translatePersonDtoToPerson(PersonDto personDto) {
        Person person = new Person();
        person.setId(personDto.getId());
        person.setName(personDto.getName());
        person.setUserId(personDto.getUserId());
        person.setPassword(personDto.getPassword());
        return person;
    }

    // Checks Name, UserID, and Password lengths
    private void validatePerson(Person person) {
        if(person.getName() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot be null");
        if(person.getUserId() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "UserID cannot be null");
        if(person.getPassword() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password cannot be null");
        if(person.getName().length() == 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot be empty");
        if(person.getUserId().length() == 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "UserID cannot be empty");
        if(person.getPassword().length() == 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password cannot be empty");

        // validate correct lengths
        if(person.getName().length() > Person.MAX_NAME_LENGTH)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Name cannot have over " + Person.MAX_NAME_LENGTH + " characters");
        if(person.getUserId().length() > Person.MAX_USERID_LENGTH)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "UserID cannot have over " + Person.MAX_USERID_LENGTH + " characters");
        if(person.getPassword().length() < Person.MIN_PASSWORD_LENGTH)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must have at least " + Person.MIN_PASSWORD_LENGTH + " characters");
        if(person.getPassword().length() > Person.MAX_PASSWORD_LENGTH)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must have at most " + Person.MAX_PASSWORD_LENGTH + " characters");
    }

    //Attempt to save a person, returns HTTP 400 Bad Request if something goes wrong
    private Person trySavePerson(Person person) {
        try{
            return personRepository.save(person);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException)
                // This happens when unique index or primary key violation occurs
                // or invalid data (such as too long of a name, userID, but that should be
                // caught through validatePerson)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name or UserID already taken");

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for new user");
        }
    }

    @GetMapping
    public Page<PersonDto> listPeople(
            @PageableDefault Pageable pageRequest
    ){
        return personRepository
                .findAll(pageRequest)
                .map(this::translatePersonToPersonDto);
    }


    @GetMapping("{id}")
    PersonDto getPerson(@PathVariable("id") Long id){
        Optional<Person> person = personRepository.findById(id);

        if(!person.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        return translatePersonToPersonDto(person.get()); //Valid ID
    }

    @PostMapping
    PersonDto savePerson(@Valid @RequestBody PersonDto personDto) {
        Person inputPerson = translatePersonDtoToPerson(personDto);
        // Validating Name, UserID, and Password lengths
        validatePerson(inputPerson);
        inputPerson.setId(null); // ID should be autogenerated

        return translatePersonToPersonDto(trySavePerson(inputPerson));
    }

    @PutMapping("{id}")
    PersonDto updatePerson(@PathVariable Long id, @Valid @RequestBody PersonDto personDto) {
        Person inputPerson = translatePersonDtoToPerson(personDto);
        validatePerson(inputPerson);

        inputPerson.setId(id);
        return translatePersonToPersonDto(trySavePerson(inputPerson));
    }

    @DeleteMapping("{id}")
    void deletePerson(@PathVariable Long id) {
        try {
            personRepository.deleteById(id);
        }catch(EmptyResultDataAccessException e) {
            // Person with ID id does not exist
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }





}
