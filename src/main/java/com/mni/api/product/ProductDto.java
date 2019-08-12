package com.mni.api.product;

import com.mni.model.product.Product;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.stream.Collectors;

@ApiModel(description="DTO for Products. Does not include multicast groups, which have separate endpoints" +
        " that take/return Collections of MulticastGroupDtos.")
public class ProductDto {

    @ApiModelProperty(value="Autogenerated ID for reference to product (used in GET, PUT, and " +
            "DELETE requests). Attempting to set a product's ID has no effect.")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @ApiModelProperty(value="Human-readable name describing the product. " +
            "Cannot be blank (a null string, empty string, or string of just " +
            "whitespace is blank).",
            required=true,
            allowableValues = "range[1,255]",
            example="US Data")
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
    public static Collection<ProductDto> translateProductsToProductDtos(Collection<Product> products) {
        return products.stream()
                .map(ProductDto::translateProductToProductDto)
                .collect(Collectors.toSet());
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ProductDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
