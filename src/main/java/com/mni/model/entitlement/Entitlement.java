package com.mni.model.entitlement;

import com.mni.model.customer.Customer;
import com.mni.model.location.Location;
import com.mni.model.product.Product;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.Date;

@Entity
public class Entitlement {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull
    private Product product;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Customer client;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;

    @NotNull
    @Positive
    private Integer numLogins;

    public Entitlement() {}

    public Entitlement(Long id, Product product, Location location, Customer client, Integer numLogins) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = null;
        this.numLogins = numLogins;
    }

    public Entitlement(Long id, Product product, Location location, Customer client, Integer numLogins, Date expirationDate) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.numLogins = numLogins;
        this.expirationDate = expirationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Customer getClient() {
        return client;
    }

    public void setClient(Customer client) {
        this.client = client;
    }

    public Date getExpirationDate() { return expirationDate; }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Integer getNumLogins() {
        return numLogins;
    }

    public void setNumLogins(Integer numLogins) {
        this.numLogins = numLogins;
    }

    @Override
    public String toString() {
        return "Entitlement{" +
                "id=" + id +
                ", product id=" + (product != null ? product.getId().toString() : "null") +
                ", location id=" + (location != null ? location.getId().toString() : "null") +
                ", client id=" + (client != null ? client.getId().toString() : "null") +
                ", expirationDate=" + expirationDate +
                ", numLogins=" + numLogins +
                '}';
    }
}
