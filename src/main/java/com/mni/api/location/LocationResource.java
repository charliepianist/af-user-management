package com.mni.api.location;

import com.mni.model.location.Location;
import com.mni.model.location.LocationRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

@RestController
@RequestMapping("/api/locations")
@Api("REST API Endpoint for Locations.")
public class LocationResource {

    private static final Logger logger = LoggerFactory.getLogger(LocationResource.class);

    @Autowired
    private LocationRepository locationRepository;

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
    @ApiOperation("Takes in parameters for sorting/pagination and returns a page of LocationDto objects.")
    public Page<LocationDto> listLocations(@RequestParam(value="page", defaultValue="0")
                                               @ApiParam("Page number, indexed at 0.")
                                                       int page,
                                           @RequestParam(value="size", defaultValue=DEFAULT_PAGE_SIZE + "")
                                               @ApiParam("Number of locations per page.")
                                                       int size,
                                           @RequestParam(value="sortBy", defaultValue=DEFAULT_SORT_FIELD)
                                               @ApiParam(value = "Field to sort locations by.",
                                                       allowableValues = "id, name, code")
                                                       String sortBy,
                                           @RequestParam(value="desc", defaultValue="false")
                                               @ApiParam("Whether the page is sorted descending or not.")
                                                       boolean desc) {
        logger.debug("GET received: page=" + page + ", size=" + size + ", sortBy='" +
                sortBy + "', desc=" + desc);
        if(page < 0) page = 0;
        if(size < MIN_PAGE_SIZE) size = MIN_PAGE_SIZE;
        if(size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;
        if(!isSortableField(sortBy)) sortBy = DEFAULT_SORT_FIELD;
        logger.trace("GET validated: page=" + page + ", size=" + size +
                ", sortBy='" + sortBy + "', desc=" + desc);

        Sort.Direction direction = desc ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortBy);
        order = order.ignoreCase();
        Sort sort = Sort.by(order);
        Pageable pageRequest = PageRequest.of(page, size, sort);

        Page<Location> locations = locationRepository.findAll(pageRequest);
        logger.trace("GET findAll returned: " + locations.getContent());
        Page<LocationDto> locationDtos = locations.map(LocationDto::translateLocationToLocationDto);
        logger.debug("GET returning: " + locationDtos.getContent());
        return locationDtos;
    }


    @GetMapping("{id}")
    @ApiOperation("Returns a LocationDto object for a specific location given an ID.")
    public LocationDto getLocation(@PathVariable("id") @ApiParam("Location ID to search for.")
                                               Long id){
        logger.debug("GET with ID " + id + " received.");
        Optional<Location> locationOptional = locationRepository.findById(id);

        if(!locationOptional.isPresent()) {
            logger.debug("GET with ID " + id + " did not find a Location");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND); // Invalid ID
        }

        Location location = locationOptional.get();
        logger.trace("GET with ID " + id + " findById returned: " + location);
        LocationDto locationDto = translateLocationToLocationDto(location);
        logger.debug("GET with ID " + id + " returned: " + locationDto);
        return locationDto; //Valid ID
    }

    @PostMapping
    @ApiOperation("Saves a new location given a LocationDto object.")
    public LocationDto saveLocation(@Valid @RequestBody @ApiParam("LocationDto object to save.")
                                                LocationDto locationDto) {
        logger.debug("POST Received: " + locationDto);
        Location inputLocation = translateLocationDtoToLocation(locationDto);
        inputLocation.setId(null); // ID should be autogenerated
        logger.trace("POST attempting to save: " + inputLocation);

        Location persistedLocation = trySaveLocation(inputLocation);
        logger.info("POST saved new Location: " + persistedLocation);
        LocationDto returnLocation = translateLocationToLocationDto(persistedLocation);
        logger.trace("POST returning: " + returnLocation);
        return returnLocation;
    }

    @PutMapping("{id}")
    @ApiOperation("Updates a location (if location with given ID is not found, returns 404 NOT FOUND).")
    public LocationDto updateLocation(@PathVariable @ApiParam("ID of location to update.")
                                                  Long id,
                                      @Valid @RequestBody @ApiParam("Updated LocationDto object")
                                              LocationDto locationDto) {
        logger.debug("PUT with ID " + id + " received: " + locationDto);
        if(!locationRepository.existsById(id)) {
            logger.debug("PUT with ID " + id + " did not find a Location");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Location inputLocation = translateLocationDtoToLocation(locationDto);
        inputLocation.setId(id);
        logger.trace("PUT with ID " + id + " attempting to save: " + inputLocation);

        Location savedLocation = trySaveLocation(inputLocation);
        logger.info("PUT with ID " + id + " updated Location to: " + savedLocation);
        LocationDto returnLocation = translateLocationToLocationDto(savedLocation);
        logger.trace("PUT with ID " + id + " returning: " + returnLocation);
        return returnLocation;
    }

    @DeleteMapping("{id}")
    @ApiOperation("Deletes a location with a given ID. Returns 404 NOT FOUND if location doesn't exist." +
            "\nAll entitlements at the location will be deleted.")
    public void deleteLocation(@PathVariable @ApiParam("ID of location to delete.") Long id) {
        logger.debug("DELETE with ID " + id + " received");
        Optional<Location> optionalLocation = locationRepository.findById(id);
        if(optionalLocation.isPresent()) {
            Location location = optionalLocation.get();
            locationRepository.deleteById(id);
            logger.info("DELETE with ID " + id + " deleted " + location);
        }else {
            logger.debug("DELETE with ID " + id + " had invalid ID");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
