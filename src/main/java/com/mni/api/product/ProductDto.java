package com.mni.api.product;

import com.mni.model.product.Product;

import javax.validation.constraints.NotBlank;

public class ProductDto {

    private Long id;

    @NotBlank
    private String name;

    public ProductDto() {}

    public ProductDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ProductDto translateProductToProductDto(Product product) {
        if(product == null) return null;
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        return productDto;
    }
    public static Product translateProductDtoToProduct(ProductDto productDto) {
        if(productDto == null) return null;
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        return product;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
