package com.mni.model.customer;

import com.mni.model.customer.Customer;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by will.schick on 6/17/19.
 */
public interface CustomerRepository extends PagingAndSortingRepository<Customer, Long> {}
