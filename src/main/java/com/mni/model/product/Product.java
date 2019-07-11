package com.mni.model.product;


import com.mni.model.multicastgroup.MulticastGroup;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "product_multicast_groups",
            joinColumns =  @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "multicast_group_id")
    )
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
        this.multicastGroups = multicastGroups;
    }
}
