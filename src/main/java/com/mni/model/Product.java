package com.mni.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by charles.liu on 6/26/19.
 */
@Entity
public class Product {

    public static final int MAX_NAME_LENGTH = 100;

    @Id
    @GeneratedValue
    private Long id;
    @Column(unique=true, length=MAX_NAME_LENGTH)
    private String name;

    public Product(){}

    public Product(Long id, String name) {
        this.id = id;
        this.name = name;
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
}
