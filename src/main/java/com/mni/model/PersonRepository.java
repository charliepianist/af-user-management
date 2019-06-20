package com.mni.model;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * Created by will.schick on 6/17/19.
 */
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {}
