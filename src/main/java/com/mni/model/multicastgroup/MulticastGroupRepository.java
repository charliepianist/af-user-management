package com.mni.model.multicastgroup;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Set;

public interface MulticastGroupRepository extends PagingAndSortingRepository<MulticastGroup, Long> {
    Set<MulticastGroup> findByAutoAssign(boolean autoAssign);
}
