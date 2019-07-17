package com.mni.model.customer;

import com.mni.model.entitlement.Entitlement;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
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

    @NotNull
    private boolean disabled;

    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL)
    @NotNull
    Collection<Entitlement> entitlements;

    public Customer() {}

    public Customer(Long id, String name, String userId, String password,
                    Collection<Entitlement> entitlements) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.password = password;
        this.entitlements = entitlements;
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
}
