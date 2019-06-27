package com.mni.model;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by charles.liu on 6/26/19.
 */
public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {}
