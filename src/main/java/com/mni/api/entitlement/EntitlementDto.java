package com.mni.api.entitlement;

import com.mni.api.customer.CustomerDto;
import com.mni.api.location.LocationDto;
import com.mni.api.product.ProductDto;
import com.mni.model.entitlement.Entitlement;

import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static com.mni.api.customer.CustomerDto.translateCustomerDtoToCustomer;
import static com.mni.api.customer.CustomerDto.translateCustomerToCustomerDto;
import static com.mni.api.location.LocationDto.translateLocationDtoToLocation;
import static com.mni.api.location.LocationDto.translateLocationToLocationDto;
import static com.mni.api.product.ProductDto.translateProductDtoToProduct;
import static com.mni.api.product.ProductDto.translateProductToProductDto;

public class EntitlementDto {
    private Long id;

    @NotNull
    private ProductDto product;

    @NotNull
    private LocationDto location;

    private CustomerDto client;

    private Date expirationDate;

    public EntitlementDto() {}

    public EntitlementDto(Long id, ProductDto product, LocationDto location, CustomerDto client) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = null;
    }

    public EntitlementDto(Long id, ProductDto product, LocationDto location, CustomerDto client, Date expirationDate) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = expirationDate;
    }

    public static EntitlementDto entitlementToEntitlementDto(Entitlement entitlement) {
        if(entitlement == null) return null;
        EntitlementDto entitlementDto = new EntitlementDto();
        entitlementDto.setId(entitlement.getId());
        entitlementDto.setProduct(
                translateProductToProductDto(entitlement.getProduct()));
        entitlementDto.setLocation(
                translateLocationToLocationDto(entitlement.getLocation()));
        entitlementDto.setClient(
                translateCustomerToCustomerDto(entitlement.getClient()));
        entitlementDto.setExpirationDate(entitlement.getExpirationDate());
        return entitlementDto;
    }

    public static Entitlement entitlementDtoToEntitlement(EntitlementDto entitlementDto) {
        if(entitlementDto == null) return null;
        Entitlement entitlement = new Entitlement();
        entitlement.setId(entitlementDto.getId());
        entitlement.setProduct(
                translateProductDtoToProduct(entitlementDto.getProduct()));
        entitlement.setLocation(
                translateLocationDtoToLocation(entitlementDto.getLocation()));
        entitlement.setClient(
                translateCustomerDtoToCustomer(entitlementDto.getClient()));
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

    public ProductDto getProduct() {
        return product;
    }

    public void setProduct(ProductDto product) {
        this.product = product;
    }

    public LocationDto getLocation() {
        return location;
    }

    public void setLocation(LocationDto location) {
        this.location = location;
    }

    public CustomerDto getClient() {
        return client;
    }

    public void setClient(CustomerDto client) {
        this.client = client;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
}
