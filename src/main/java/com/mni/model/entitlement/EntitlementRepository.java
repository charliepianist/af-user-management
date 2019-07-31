package com.mni.model.entitlement;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface EntitlementRepository extends PagingAndSortingRepository<Entitlement, Long> {
    List<Entitlement> findByLocation_Code(String code);
}
