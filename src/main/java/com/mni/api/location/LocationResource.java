package com.mni.api.location;

import com.mni.model.location.Location;
import com.mni.model.location.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Optional;

import static com.mni.api.location.LocationDto.translateLocationDtoToLocation;
import static com.mni.api.location.LocationDto.translateLocationToLocationDto;

/**
 * Created by charles.liu on 6/26/19.
 */

@RestController
@RequestMapping("/api/locations")
public class LocationResource {

    @Autowired
    LocationRepository locationRepository;

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final String DEFAULT_SORT_FIELD = "code";

    // Returns whether a String is a sortable field of Location
    private boolean isSortableField(String field) {
        return field.equals("id") || field.equals("name") || field.equals("code");
    }

    //Attempt to save a location, returns HTTP 400 Bad Request if something goes wrong
    private Location trySaveLocation(Location location) {
        try{
            return locationRepository.save(location);
        }catch(Exception e) {
            if(e instanceof DataIntegrityViolationException)
                // Unique index violation (ID or Name)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Name or Code already taken");

            // In case of exception that isn't due to unique index or primary key violation
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid arguments for new location");
        }
    }

    @GetMapping
    public Page<LocationDto> listLocations(@RequestParam(value="page", defaultValue="0") int page,
                                           @RequestParam(value="size", defaultValue=DEFAULT_PAGE_SIZE + "")
                                                 int size,
                                           @RequestParam(value="sortBy", defaultValue=DEFAULT_SORT_FIELD)
                                                 String sortBy,
                                           @RequestParam(value="desc", defaultValue="false") boolean desc
    ){
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isSortableField(sortBy)) sortBy = DEFAULT_SORT_FIELD;

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);
        return locationRepository
                .findAll(pageRequest)
                .map(LocationDto::translateLocationToLocationDto);
    }


    @GetMapping("{id}")
    public LocationDto getLocation(@PathVariable("id") Long id){
        Optional<Location> location = locationRepository.findById(id);

        if(!location.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        return translateLocationToLocationDto(location.get()); //Valid ID
    }

    @PostMapping
    public LocationDto saveLocation(@Valid @RequestBody LocationDto locationDto) {
        Location inputLocation = translateLocationDtoToLocation(locationDto);
        inputLocation.setId(null); // ID should be autogenerated

        return translateLocationToLocationDto(trySaveLocation(inputLocation));
    }

    @PutMapping("{id}")
    public LocationDto updateLocation(@PathVariable Long id, @Valid @RequestBody LocationDto locationDto) {
        Location inputLocation = translateLocationDtoToLocation(locationDto);

        inputLocation.setId(id);
        return translateLocationToLocationDto(trySaveLocation(inputLocation));
    }

    @DeleteMapping("{id}")
    public void deleteLocation(@PathVariable Long id) {
        try {
            locationRepository.deleteById(id);
        }catch(EmptyResultDataAccessException e) {
            // Location with ID id does not exist
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
