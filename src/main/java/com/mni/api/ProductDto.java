package com.mni.api;

import com.mni.model.Product;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Created by charles.liu on 6/26/19.
 */
public class ProductDto {

    private Long id;

    @NotBlank
    @Size(max = Product.MAX_NAME_LENGTH, message = "Product cannot be over " + Product.MAX_NAME_LENGTH +
            " characters long")
    private String name;

    public ProductDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public ProductDto() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
