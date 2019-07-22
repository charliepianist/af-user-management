package com.mni.model.multicastgroup;

import com.mni.model.product.Product;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;

@Entity
public class MulticastGroup {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true)
    private String name;

    private String ip;

    private Integer port;

    @NotNull
    @ManyToMany(mappedBy="multicastGroups")
    Collection<Product> products;

    public MulticastGroup() {}

    public MulticastGroup(Long id, String name, String ip, Integer port) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.products = new ArrayList();
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

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public Collection<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Collection<Product> products) {
        if(this.products == null) this.products = new ArrayList();
        this.products.clear();
        this.products.addAll(products);
    }
}
