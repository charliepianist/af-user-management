package com.mni.model.location;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface LocationRepository extends PagingAndSortingRepository<Location, Long> {
    boolean existsByCode(String code);
}