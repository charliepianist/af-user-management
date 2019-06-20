package com.mni.model;

import javax.annotation.Generated;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by will.schick on 6/17/19.
 */
@Entity
public class Person {

    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_USERID_LENGTH = 20;
    public static final int MIN_PASSWORD_LENGTH = 15;
    public static final int MAX_PASSWORD_LENGTH = 100;

    @Id
    @GeneratedValue
    private Long id;
    @Column(unique=true, length=100)
    private String name;
    @Column(unique=true, length=20)
    private String userId;
    @Column(unique=true, length=100)
    private String password;

    public Person(){}

    public Person(Long id, String name, String userId, String password) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
