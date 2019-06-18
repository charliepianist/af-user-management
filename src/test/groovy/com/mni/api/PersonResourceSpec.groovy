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

}
