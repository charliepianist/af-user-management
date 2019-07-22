package com.mni.model.product;


import com.mni.model.multicastgroup.MulticastGroup;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;

@Entity
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true)
    private String name;

    @NotNull
    @ManyToMany
    Collection<MulticastGroup> multicastGroups;

    public Product(){}

    public Product(Long id, String name, Collection<MulticastGroup> multicastGroups) {
        this.id = id;
        this.name = name;
        this.multicastGroups = multicastGroups;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Collection<MulticastGroup> getMulticastGroups() { return multicastGroups; }

    public void setMulticastGroups(Collection<MulticastGroup> multicastGroups) {
        if(this.multicastGroups == null) this.multicastGroups = new ArrayList();
        this.multicastGroups.clear();
        this.multicastGroups.addAll(multicastGroups);
    }

    public void addMulticastGroup(MulticastGroup multicastGroup) {
        if(this.multicastGroups == null) this.multicastGroups = new ArrayList();
        this.multicastGroups.add(multicastGroup);
    }

    public boolean removeMulticastGroup(MulticastGroup multicastGroup) {
        return this.multicastGroups.removeIf(group -> group.getId() == multicastGroup.getId());
    }
}
