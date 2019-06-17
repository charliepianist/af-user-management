package com.mni.model;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by will.schick on 6/17/19.
 */
public interface PersonRepository extends CrudRepository<Person, Long> {
}
