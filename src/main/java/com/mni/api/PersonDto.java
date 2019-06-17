package com.mni.api;

import com.mni.model.Person;

/**
 * Created by will.schick on 6/17/19.
 */
public class PersonDto {

    private Long id;
    private String firstname;
    private String lastname;


    public PersonDto(){}

    public PersonDto(Long id,String firstname, String lastname){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLastname() {
        return lastname;
    }

    public String getFirstname() {
        return firstname;
    }


    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
}
