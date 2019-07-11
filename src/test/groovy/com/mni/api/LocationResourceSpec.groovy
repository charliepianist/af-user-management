package com.mni.api

import com.mni.api.location.LocationDto
import com.mni.api.location.LocationResource
import com.mni.model.location.Location
import com.mni.model.location.LocationRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Specification

/**
 * Created by charles.liu on 6/26/19.
 */
class LocationResourceSpec extends Specification {

    LocationResource locationResource
    void setup(){
        locationResource = new LocationResource()
        locationResource.locationRepository = Mock(LocationRepository)
    }

    void "getLocation() should return a LocationDto object when called with a valid ID" () {
        when:
        "getLocation(1) is called"
        def result = locationResource.getLocation(1)

        then:
        "locationRepository should call findById(1), which will return a Location object"
        1 * locationResource.locationRepository.findById(1) >> Optional.of(
                new Location(1, "CHI1", "Chicago 1"))

        and:
        "The location returned by getLocation() should be the same as the location given by the repository"
        result instanceof LocationDto
        result.getId() == 1L
        result.getCode() == "CHI1"
        result.getName() == "Chicago 1"
    }

    void "getLocation() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getLocation() is called with an invalid ID"
        def result = locationResource.getLocation(-1)

        then:
        "locationRepository should call findById(-1), which will return an empty Optional object"
        1 * locationResource.locationRepository.findById(-1) >> Optional.empty()

        and:
        "The result from getLocation() should be null"
        thrown(ResponseStatusException)
        result == null
    }

    void "saveLocation() with a new name and code should return a new persisted location" () {
        when:
        "saveLocation() is called with a valid new name"
        def result = locationResource.saveLocation(new LocationDto(null, "CHI1", "Chicago 1"))

        then:
        "locationRepository should call save, returning the saved Location object"
        1 * locationResource.locationRepository.save({ Location location ->
            location.getCode() == "CHI1" && location.getName() == "Chicago 1"
        }) >> new Location(120, "CHI1", "Chicago 1")

        and:
        "Returned location should be the persisted LocationDto object"
        result instanceof LocationDto
        result.getId() == 120L
        result.getCode() == "CHI1"
        result.getName() == "Chicago 1"
    }

    void "listLocations() should return the current locations" () {
        given:
        def locations = new PageImpl([
                new Location(1, "CHI1", "Chicago 1"),
                new Location(2, "CHI2", "Chicago 2")
        ])

        when:
        "listLocations() is called"
        def result = locationResource.listLocations(0, 20, "id", true).getContent()

        then:
        "Call findAll(), returning list of locations"
        1 * locationResource.locationRepository.findAll(_) >> locations

        and:
        "Correct locations are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getCode() == "CHI1"
        result[0].getName() == "Chicago 1"

        result[1].getId() == 2L
        result[1].getCode() == "CHI2"
        result[1].getName() == "Chicago 2"
    }

    void "listLocations() should use default parameters given invalid parameters" () {
        given:
        def locations = new PageImpl([
                new Location(1, "CHI1", "Chicago 1"),
                new Location(2, "CHI2", "Chicago 2")
        ])

        when:
        "listLocations() is given invalid parameters"
        locationResource.listLocations(-1, -1, "NOT A SORT FIELD", false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * locationResource.locationRepository.findAll({ Pageable pageRequest ->
            pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == LocationResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == LocationResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            LocationResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }) >> locations
    }

    void "deleteLocation(id) should call deleteById() to delete the location" () {
        when:
        "deleteLocation(1) is called"
        locationResource.deleteLocation(1)

        then:
        "deleteById(1) should be called"
        1 * locationResource.locationRepository.deleteById(1)
    }

    void "updateLocation() should call save() to save location and return new location" () {
        given:
        LocationDto locationDto = new LocationDto(1, "CHI1", "New Name")

        when:
        "updateLocation() is called"
        def result = locationResource.updateLocation(1, locationDto)

        then:
        "save() should be called"
        1 * locationResource.locationRepository.save({ Location location ->
            location.getId() == 1L &&
                    location.getName() == "New Name" && location.getCode() == "CHI1"
        }) >> new Location(1L, "CHI1", "New Name")

        and:
        "Correct result should be returned"
        result instanceof LocationDto
        result.getId() == locationDto.getId()
        result.getCode() == locationDto.getCode()
        result.getName() == locationDto.getName()
    }
}
