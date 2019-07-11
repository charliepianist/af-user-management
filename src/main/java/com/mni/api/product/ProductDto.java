package com.mni.api.product;

import com.mni.model.multicastgroup.MulticastGroup;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Collection;

public class ProductDto {

    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Collection<MulticastGroup> multicastGroups;


    public ProductDto() {}

    public ProductDto(Long id, String name, Collection<MulticastGroup> multicastGroups) {
        this.id = id;
        this.name = name;
        this.multicastGroups = multicastGroups;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Collection<MulticastGroup> getMulticastGroups() { return multicastGroups; }

    public void setMulticastGroups(Collection<MulticastGroup> multicastGroups) {
        this.multicastGroups = multicastGroups;
    }
}
