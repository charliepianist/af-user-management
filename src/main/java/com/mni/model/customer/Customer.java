package com.mni.model.customer;

import com.mni.model.entitlement.Entitlement;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

/**
 * Created by will.schick on 6/17/19.
 */
@Entity
public class Customer {

    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_USERID_LENGTH = 20;
    public static final int MIN_PASSWORD_LENGTH = 15;
    public static final int MAX_PASSWORD_LENGTH = 100;

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true, length=MAX_NAME_LENGTH)
    private String name;

    @Column(unique=true, length=MAX_USERID_LENGTH)
    private String userId;

    @Column(length=MAX_PASSWORD_LENGTH)
    private String password;

    private Character clientType;

    private Integer priority;

    @NotNull
    private boolean disabled;

    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL, mappedBy = "client")
    @NotNull
    Collection<Entitlement> entitlements = new ArrayList();

    public Customer() {}

    public Customer(Long id, String name, String userId, String password,
                    Character clientType, Integer priority,
                    Collection<Entitlement> entitlements) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
        this.clientType = clientType;
        this.priority = priority;
        this.entitlements = entitlements;
    }

    public Customer(Long id, String name, String userId, String password,
                    Character clientType, Integer priority,
                    Collection<Entitlement> entitlements, boolean disabled) {
        this(id, name, userId, password, clientType, priority, entitlements);
        this.disabled = disabled;
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

    public Collection<Entitlement> getEntitlements() {
        return entitlements;
    }

    public void setEntitlements(Collection<Entitlement> entitlements) {
        if(this.entitlements == null) this.entitlements = new ArrayList();
        this.entitlements.clear();
        this.entitlements.addAll(entitlements);
    }

    public void setDisabled(boolean disabled) { this.disabled = disabled; }

    public boolean isDisabled() { return disabled; }

    public Character getClientType() {
        return clientType;
    }

    public void setClientType(Character clientType) {
        this.clientType = clientType;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        char[] chars = new char[password.length()];
        Arrays.fill(chars, '*');
        String asterisks = new String(chars);
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", userId='" + userId + '\'' +
                ", password='" + asterisks + '\'' +
                ", clientType=" + clientType +
                ", priority=" + priority +
                ", disabled=" + disabled +
                ", entitlements=" + entitlements +
                '}';
    }
}
