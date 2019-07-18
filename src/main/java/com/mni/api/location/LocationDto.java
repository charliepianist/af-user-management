package com.mni.api.location;

import com.mni.model.location.Location;

import javax.validation.constraints.NotBlank;

public class LocationDto {

    private Long id;

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    public LocationDto() {}

    public LocationDto(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static LocationDto translateLocationToLocationDto(Location location) {
        if(location == null) return null;
        LocationDto locationDto = new LocationDto();
        locationDto.setId(location.getId());
        locationDto.setCode(location.getCode());
        locationDto.setName(location.getName());
        return locationDto;
    }
    public static Location translateLocationDtoToLocation(LocationDto locationDto) {
        if(locationDto == null) return null;
        Location location = new Location();
        location.setId(locationDto.getId());
        location.setCode(locationDto.getCode());
        location.setName(locationDto.getName());
        return location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
