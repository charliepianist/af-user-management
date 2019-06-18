package com.mni.model;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by will.schick on 6/17/19.
 */
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {
}
