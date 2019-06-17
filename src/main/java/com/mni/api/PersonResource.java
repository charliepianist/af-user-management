package com.mni.api;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Created by will.schick on 6/17/19.
 */
@RestController
public class PersonResource {


    @Autowired
    PersonRepository personRepository;


    private PersonDto personToPersonDto(Person person){
        return new PersonDto(person.getId(),person.getFirstname(), person.getLastname());
    }

    private Person personDtoToPerson(PersonDto person){
        return new Person(person.getId(),person.getFirstname(), person.getLastname());
    }

    @GetMapping
    public Collection<PersonDto> listPeople(){
        return StreamSupport.stream(personRepository.findAll().spliterator(),false)
                .map(this::personToPersonDto)
                .collect(Collectors.toList());
    }


    @GetMapping("{id}")
    PersonDto getPerson(@PathVariable("id") Long id){
        return
                personToPersonDto(
                        personRepository
                                .findById(id)
                                .orElseThrow(()->new IllegalArgumentException("Not found: " + id))
                );
    }

    @PostMapping
    PersonDto savePerson(@RequestBody PersonDto personDto){
        return personToPersonDto(
                personRepository.save(
                        personDtoToPerson(personDto)
                )
        );
    }




}
