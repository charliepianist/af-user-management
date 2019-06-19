package com.mni.api;

import com.mni.model.Person;
import com.mni.model.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

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

        if(!person.isPresent()) return null; // Invalid ID
        return translatePersonToPersonDto(person.get()); //Valid ID
    }

    @PostMapping
    PersonDto savePerson(@RequestBody PersonDto personDto) {
        Person person = personRepository.save(translatePersonDtoToPerson(personDto));
        return translatePersonToPersonDto(person);
    }

    @DeleteMapping("{id}")
    void deletePerson(@PathVariable Long id) {
        personRepository.deleteById(id);
    }





}
