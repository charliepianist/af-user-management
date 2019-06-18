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


    private PersonDto translatePersonToPersonDto(Person person){
        PersonDto personDto = new PersonDto();
        personDto.setId(person.getId());
        return personDto;
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
        return null;
    }

    @PostMapping
    PersonDto savePerson(@RequestBody PersonDto personDto){
        return null;
    }




}
