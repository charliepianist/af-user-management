package com.mni.api

import com.mni.api.multicastgroup.MulticastGroupDto
import com.mni.api.multicastgroup.MulticastGroupResource
import com.mni.model.multicastgroup.MulticastGroup
import com.mni.model.multicastgroup.MulticastGroupRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.web.server.ResponseStatusException
import spock.lang.Specification

class MulticastGroupResourceSpec extends Specification {

    MulticastGroupResource multicastGroupResource

    void setup(){
        multicastGroupResource = new MulticastGroupResource()
        multicastGroupResource.multicastGroupRepository = Mock(MulticastGroupRepository)
    }

    void "getMulticastGroup() should return a MulticastGroupDto object when called with a valid ID" () {
        when:
        "getMulticastGroup(1) is called"
        def result = multicastGroupResource.getMulticastGroup(1)

        then:
        "multicastGroupRepository should call findById(1), which will return a MulticastGroup object"
        1 * multicastGroupResource.multicastGroupRepository.findById(1) >> Optional.of(
                new MulticastGroup(1, "Example Group", "192.168.1.1", 4000))

        and:
        "The multicastGroup returned by getMulticastGroup() should be the same as the multicastGroup given by the repository"
        result instanceof MulticastGroupDto
        result.getId() == 1L
        result.getName() == "Example Group"
        result.getIp() == "192.168.1.1"
        result.getPort() == 4000
    }

    void "getMulticastGroup() should return null and throw an exception when called with an invalid ID" () {
        when:
        "getMulticastGroup() is called with an invalid ID"
        def result = multicastGroupResource.getMulticastGroup(-1)

        then:
        "multicastGroupRepository should call findById(-1), which will return an empty Optional object"
        1 * multicastGroupResource.multicastGroupRepository.findById(-1) >> Optional.empty()

        and:
        "The result from getMulticastGroup() should be null"
        thrown(ResponseStatusException)
        result == null
    }

    void "saveMulticastGroup() with a new name and code should return a new persisted multicastGroup" () {
        when:
        "saveMulticastGroup() is called with a valid new name"
        def result = multicastGroupResource.saveMulticastGroup(
                new MulticastGroupDto(null, "Example Group", "192.168.1.1", 4000))

        then:
        "multicastGroupRepository should call save, returning the saved MulticastGroup object"
        1 * multicastGroupResource.multicastGroupRepository.save({ MulticastGroup multicastGroup ->
            multicastGroup.getName() == "Example Group" && multicastGroup.getIp() == "192.168.1.1" &&
                    multicastGroup.getPort() == 4000
        }) >> new MulticastGroup(120L, "Example Group", "192.168.1.1", 4000)

        and:
        "Returned multicastGroup should be the persisted MulticastGroupDto object"
        result instanceof MulticastGroupDto
        result.getId() == 120L
        result.getName() == "Example Group"
        result.getIp() == "192.168.1.1"
        result.getPort() == 4000
    }

    void "listMulticastGroups() should return the current multicastGroups" () {
        given:
        def multicastGroups = new PageImpl([
                new MulticastGroup(1, "Example Group 1", "192.168.1.1", 4000),
                new MulticastGroup(2, "Example Group 2", "192.168.1.2", 4001)
        ])

        when:
        "listMulticastGroups() is called"
        def result = multicastGroupResource.listMulticastGroups(0, 20, "name", true).getContent()

        then:
        "Call findAll(), returning list of multicastGroups"
        1 * multicastGroupResource.multicastGroupRepository.findAll(_) >> multicastGroups

        and:
        "Correct multicastGroups are returned"
        result.size() == 2

        result[0].getId() == 1L
        result[0].getName() == "Example Group 1"
        result[0].getIp() == "192.168.1.1"
        result[0].getPort() == 4000

        result[1].getId() == 2L
        result[1].getName() == "Example Group 2"
        result[1].getIp() == "192.168.1.2"
        result[1].getPort() == 4001
    }

    void "listMulticastGroups() should use default parameters given invalid parameters" () {
        given:
        def multicastGroups = new PageImpl([
                new MulticastGroup(1, "Example Group 1", "192.168.1.1", 4000),
                new MulticastGroup(2, "Example Group 2", "192.168.1.2", 4001)
        ])

        when:
        "listMulticastGroups() is given invalid parameters"
        multicastGroupResource.listMulticastGroups(-1, -1, "NOT A SORT FIELD", false)

        then:
        "findAll should be called with default page, size, and sortBy parameters, and false desc"
        1 * multicastGroupResource.multicastGroupRepository.findAll({ Pageable pageRequest ->
            pageRequest.getPageNumber() == 0 &&
                    pageRequest.getPageSize() == MulticastGroupResource.MIN_PAGE_SIZE &&
                    pageRequest.getSort().first().getProperty() == MulticastGroupResource.DEFAULT_SORT_FIELD &&
                    pageRequest.getSort().getOrderFor(
                            MulticastGroupResource.DEFAULT_SORT_FIELD).getDirection() == Sort.Direction.ASC
        }) >> multicastGroups
    }

    void "deleteMulticastGroup(id) should call deleteById() to delete the multicastGroup" () {
        when:
        "deleteMulticastGroup(1) is called"
        multicastGroupResource.deleteMulticastGroup(1)

        then:
        "findById() can be called"
        (0..1) * multicastGroupResource.multicastGroupRepository.findById(1) >>
                Optional.of(new MulticastGroup(1, "Name", "Ip", 1000))

        and:
        "deleteById(1) should be called"
        1 * multicastGroupResource.multicastGroupRepository.deleteById(1)
    }

    void "updateMulticastGroup() should call save() to save multicastGroup and return new multicastGroup" () {
        given:
        MulticastGroupDto multicastGroupDto =
                new MulticastGroupDto(1, "Example Group", "192.168.1.1", 4000)

        when:
        "updateMulticastGroup() is called"
        def result = multicastGroupResource.updateMulticastGroup(1, multicastGroupDto)

        then:
        "save() should be called"
        1 * multicastGroupResource.multicastGroupRepository.existsById(1) >> true
        1 * multicastGroupResource.multicastGroupRepository.save({ MulticastGroup multicastGroup ->
            multicastGroup.getId() == 1L &&
                    multicastGroup.getName() == "Example Group" && multicastGroup.getIp() == "192.168.1.1" &&
                    multicastGroup.getPort() == 4000
        }) >> new MulticastGroup(1, "Example Group", "192.168.1.1", 4000)

        and:
        "Correct result should be returned"
        result instanceof MulticastGroupDto
        result.getId() == multicastGroupDto.getId()
        result.getIp() == multicastGroupDto.getIp()
        result.getName() == multicastGroupDto.getName()
        result.getPort() == multicastGroupDto.getPort()
    }
}
