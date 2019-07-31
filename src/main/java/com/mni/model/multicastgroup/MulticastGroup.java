package com.mni.model.multicastgroup;

import com.mni.model.product.Product;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;

@Entity
public class MulticastGroup {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique=true)
    private String name;

    @Column(unique=true)
    private String code;

    private boolean autoAssign;

    private String ip;

    private Integer port;

    @NotNull
    @ManyToMany(mappedBy="multicastGroups")
    Collection<Product> products = new ArrayList();

    public MulticastGroup() {}

    public MulticastGroup(Long id, String name, String code, boolean autoAssign, String ip, Integer port) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.autoAssign = autoAssign;
        this.ip = ip;
        this.port = port;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isAutoAssign() {
        return autoAssign;
    }

    public void setAutoAssign(boolean autoAssign) {
        this.autoAssign = autoAssign;
    }

    @Override
    public String toString() {
        return "MulticastGroup{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", autoAssign=" + autoAssign +
                ", ip='" + ip + '\'' +
                ", port=" + port +
                ", products ids=" + products.stream().map(p -> p.getId()).collect(Collectors.toList()) +
                '}';
    }
}
