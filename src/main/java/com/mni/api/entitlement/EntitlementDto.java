package com.mni.api.entitlement;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mni.model.customer.Customer;
import com.mni.model.entitlement.Entitlement;
import com.mni.model.location.Location;
import com.mni.model.product.Product;

import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

public class EntitlementDto {
    private Long id;

    @NotNull
    private Product product;

    @NotNull
    private Location location;

    @JsonBackReference
    private Customer client;

    private Date expirationDate;

    public EntitlementDto() {}

    public EntitlementDto(Long id, Product product, Location location, Customer client) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = null;
    }

    public EntitlementDto(Long id, Product product, Location location, Customer client, Date expirationDate) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = expirationDate;
    }

    public static EntitlementDto entitlementToEntitlementDto(Entitlement entitlement) {
        EntitlementDto entitlementDto = new EntitlementDto();
        entitlementDto.setId(entitlement.getId());
        entitlementDto.setProduct(entitlement.getProduct());
        entitlementDto.setLocation(entitlement.getLocation());
        entitlementDto.setClient(entitlement.getClient());
        entitlementDto.setExpirationDate(entitlement.getExpirationDate());
        return entitlementDto;
    }

    public static Entitlement entitlementDtoToEntitlement(EntitlementDto entitlementDto) {
        Entitlement entitlement = new Entitlement();
        entitlement.setId(entitlementDto.getId());
        entitlement.setProduct(entitlementDto.getProduct());
        entitlement.setLocation(entitlementDto.getLocation());
        entitlement.setClient(entitlementDto.getClient());
        entitlement.setExpirationDate(entitlementDto.getExpirationDate());
        return entitlement;
    }

    public static Collection<EntitlementDto> entitlementsToEntitlementDtos(Collection<Entitlement> entitlements) {
        return entitlements.stream()
                .map(e -> entitlementToEntitlementDto(e))
                .collect(Collectors.toSet());
    }

    public static Collection<Entitlement> entitlementDtosToEntitlements(Collection<EntitlementDto> entitlementDtos) {
        return entitlementDtos.stream()
                .map(e -> entitlementDtoToEntitlement(e))
                .collect(Collectors.toSet());
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

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
}
