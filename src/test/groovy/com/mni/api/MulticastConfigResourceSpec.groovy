package com.mni.api

import com.mni.api.config.MulticastConfigResource
import com.mni.model.customer.Customer
import com.mni.model.entitlement.Entitlement
import com.mni.model.entitlement.EntitlementRepository
import com.mni.model.location.Location
import com.mni.model.location.LocationRepository
import com.mni.model.multicastgroup.MulticastGroup
import com.mni.model.multicastgroup.MulticastGroupRepository
import com.mni.model.product.Product
import org.springframework.web.server.ResponseStatusException
import spock.lang.Shared
import spock.lang.Specification

class MulticastConfigResourceSpec extends Specification {

    MulticastConfigResource multicastConfigResource
    @Shared Entitlement[] entitlements = new ArrayList()
    @Shared Product[] products
    @Shared Location[] locations
    @Shared Customer[] customers
    @Shared MulticastGroup[] groups
    @Shared Character c = 'c'
    @Shared Character a = 'a'
    @Shared Character r = 'r'

    void setupSpec() {
        groups = [
                new MulticastGroup(1, "Group 1", "Group_ONE", false, "192.168.1.1", 1000),
                new MulticastGroup(2, "Group 2", "Group_TWO", false, "192.168.1.1", 2000),
                new MulticastGroup(3, "Group 3", "Group_THREE", false, "192.168.12.44", 4000),
                new MulticastGroup(4, "Group 4", "Group_FOUR", false, "192.168.52.111", 4000),
                new MulticastGroup(5, "Heartbeat", "Group_HEARTBEAT", true, "192.168.242.155", 8000)
        ]
        products = [
                new Product(10, "Product 1", [groups[0], groups[2]]),
                new Product(20, "Product 2", [groups[1], groups[3]]),
                new Product(30, "Product 3", [groups[2], groups[4]])
        ]
        locations = [
                new Location(100, "CHI1", "Chicago 1"),
                new Location(200, "CHI2", "Chicago 2"),
                new Location(300, "NYC1", "New York 1"),
                new Location(400, "LON1", "London 1"),
                new Location(500, "LON2", "London 2")
        ]
        customers = [
                new Customer(3000, "Comcast", "comcast", "c123!EFAwefawef", c, 1, null),
                new Customer(4000, "Administrator", "admin", "a123!EFAwefawef", a, 2, null),
                new Customer(5000, "Reporter", "reporter", "r123!EFAwefawef", r, 3, null),
                new Customer(6000, "Xerox", "xerox", "x123!EFAwefawef", c, 1, null, true),
        ]
        /*
        *  Comcast subscribed to:
        *   Product 1 at CHI1 and CHI2
        *   Product 2 at NYC1, LON1, LON2
        *   Product 3 at LON1
        *
        *  Administrator subscribed to:
        *   Product 3 at LON1
        *   Product 2 at LON2
        *   Product 1 at NYC1
        *
        *  Reporter subscribed to:
        *   Product 3 at CHI1, CHI2, NYC1
        *   Product 2 at LON1, LON2
        *
        *  Xerox subscribed to:
        *   Product 1 at LON1
        *   Product 2 at LON1, LON2
        *   Product 3 at LON2
        */
        entitlements = [
                new Entitlement(10000, products[0], locations[0], customers[0], 2),
                new Entitlement(10001, products[0], locations[1], customers[0], 2, new Date()),
                new Entitlement(10002, products[1], locations[2], customers[0], 2),
                new Entitlement(10003, products[1], locations[3], customers[0], 1000, new Date()),
                new Entitlement(10004, products[1], locations[4], customers[0], 1000),

                new Entitlement(10005, products[2], locations[3], customers[1], 2),
                new Entitlement(10006, products[1], locations[4], customers[1], 2),
                new Entitlement(10007, products[0], locations[2], customers[1], 2),

                new Entitlement(10008, products[2], locations[0], customers[2], 2),
                new Entitlement(10009, products[2], locations[1], customers[2], 2),
                new Entitlement(10010, products[2], locations[2], customers[2], 2),
                new Entitlement(10011, products[1], locations[3], customers[2], 2),
                new Entitlement(10012, products[1], locations[4], customers[2], 2),

                new Entitlement(10013, products[2], locations[3], customers[0], 2),

                new Entitlement(10014, products[1], locations[3], customers[3], 2),
                new Entitlement(10015, products[0], locations[3], customers[3], 5),
                new Entitlement(10016, products[1], locations[4], customers[3], 2, new Date()),
                new Entitlement(10017, products[2], locations[4], customers[3], 2)
        ]
        customers[0].entitlements = [entitlements[0], entitlements[1], entitlements[2], entitlements[3], entitlements[4], entitlements[13]]
        customers[1].entitlements = [entitlements[5], entitlements[6], entitlements[7]]
        customers[2].entitlements = [entitlements[8], entitlements[9], entitlements[10], entitlements[11], entitlements[12]]
        customers[3].entitlements = [entitlements[14], entitlements[15], entitlements[16], entitlements[17]]
    }

    void setup() {
        multicastConfigResource = new MulticastConfigResource()
        multicastConfigResource.multicastGroupRepository = Mock(MulticastGroupRepository)
        multicastConfigResource.locationRepository = Mock(LocationRepository)
        multicastConfigResource.entitlementRepository = Mock(EntitlementRepository)
    }

    void "getMulticastConfig() should throw an exception with invalid location code" () {
        when:
        "getMulticastConfig() is called"
        multicastConfigResource.getMulticastConfig("Invalid code")

        then:
        "locationRepository.existsByCode() should be called, returning false"
        1 * multicastConfigResource.locationRepository.existsByCode("Invalid code") >> false

        and:
        "A ResponseStatusException should be thrown"
        thrown(ResponseStatusException)
    }

    void "getUserConfig() should throw an exception with invalid location code" () {
        when:
        "getUserConfig() is called"
        multicastConfigResource.getUserConfig("Invalid code")

        then:
        "locationRepository.existsByCode() should be called, returning false"
        1 * multicastConfigResource.locationRepository.existsByCode("Invalid code") >> false

        and:
        "A ResponseStatusException should be thrown"
        thrown(ResponseStatusException)
    }

    void "getMulticastConfig() should return the correct configuration file for CHI1" () {
        when:
        "getMulticastConfig() is called on CHI1"
        def result = multicastConfigResource.getMulticastConfig("CHI1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("CHI1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("CHI1") >>
                [entitlements[0], entitlements[8]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "Group_HEARTBEAT\t192.168.242.155:8000\tE" +
                "\nGroup_ONE\t192.168.1.1:1000\tE" +
                "\nGroup_THREE\t192.168.12.44:4000\tE"
    }

    void "getMulticastConfig() should return the correct configuration file for CHI2" () {
        when:
        "getMulticastConfig() is called on CHI2"
        def result = multicastConfigResource.getMulticastConfig("CHI2")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("CHI2") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("CHI2") >>
                [entitlements[1], entitlements[9]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "Group_HEARTBEAT\t192.168.242.155:8000\tE" +
                "\nGroup_ONE\t192.168.1.1:1000\tE" +
                "\nGroup_THREE\t192.168.12.44:4000\tE"
    }

    void "getMulticastConfig() should return the correct configuration file for NYC1" () {
        when:
        "getMulticastConfig() is called on NYC1"
        def result = multicastConfigResource.getMulticastConfig("NYC1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("NYC1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("NYC1") >>
                [entitlements[2], entitlements[7], entitlements[10]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "Group_FOUR\t192.168.52.111:4000\tE" +
                "\nGroup_HEARTBEAT\t192.168.242.155:8000\tE" +
                "\nGroup_ONE\t192.168.1.1:1000\tE" +
                "\nGroup_THREE\t192.168.12.44:4000\tE" +
                "\nGroup_TWO\t192.168.1.1:2000\tE"
    }

    void "getMulticastConfig() should return the correct configuration file for LON1" () {
        when:
        "getMulticastConfig() is called on LON1"
        def result = multicastConfigResource.getMulticastConfig("LON1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("LON1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("LON1") >>
                [entitlements[3], entitlements[5], entitlements[11], entitlements[13], entitlements[14], entitlements[15]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "Group_FOUR\t192.168.52.111:4000\tE" +
                "\nGroup_HEARTBEAT\t192.168.242.155:8000\tE" +
                "\nGroup_THREE\t192.168.12.44:4000\tE" +
                "\nGroup_TWO\t192.168.1.1:2000\tE"
    }

    void "getMulticastConfig() should return the correct configuration file for LON2" () {
        when:
        "getMulticastConfig() is called on LON2"
        def result = multicastConfigResource.getMulticastConfig("LON2")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("LON2") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("LON2") >>
                [entitlements[4], entitlements[6], entitlements[12], entitlements[16], entitlements[17]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "Group_FOUR\t192.168.52.111:4000\tE" +
                "\nGroup_HEARTBEAT\t192.168.242.155:8000\tE" +
                "\nGroup_TWO\t192.168.1.1:2000\tE"
    }

    void "getUserConfig() should return the correct configuration file for CHI1" () {
        when:
        "getUserConfig() is called on CHI1"
        def result = multicastConfigResource.getUserConfig("CHI1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("CHI1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("CHI1") >>
                [entitlements[0], entitlements[8]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "comcast\tc123!EFAwefawef\tc\t2\t1\tGroup_HEARTBEAT,Group_ONE,Group_THREE" +
                "\nreporter\tr123!EFAwefawef\tr\t2\t3\tGroup_HEARTBEAT,Group_THREE"
    }

    void "getUserConfig() should return the correct configuration file for CHI2" () {
        when:
        "getUserConfig() is called on CHI2"
        def result = multicastConfigResource.getUserConfig("CHI2")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("CHI2") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("CHI2") >>
                [entitlements[1], entitlements[9]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "comcast\tc123!EFAwefawef\tc\t2\t1\tGroup_HEARTBEAT,Group_ONE,Group_THREE" +
                "\nreporter\tr123!EFAwefawef\tr\t2\t3\tGroup_HEARTBEAT,Group_THREE"
    }

    void "getUserConfig() should return the correct configuration file for NYC1" () {
        when:
        "getUserConfig() is called on NYC1"
        def result = multicastConfigResource.getUserConfig("NYC1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("NYC1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("NYC1") >>
                [entitlements[2], entitlements[7], entitlements[10]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "comcast\tc123!EFAwefawef\tc\t2\t1\tGroup_FOUR,Group_HEARTBEAT,Group_TWO" +
                "\nadmin\ta123!EFAwefawef\ta\t2\t2\tGroup_HEARTBEAT,Group_ONE,Group_THREE"+
                "\nreporter\tr123!EFAwefawef\tr\t2\t3\tGroup_HEARTBEAT,Group_THREE"
    }

    void "getUserConfig() should return the correct configuration file for LON1" () {
        when:
        "getUserConfig() is called on LON1"
        def result = multicastConfigResource.getUserConfig("LON1")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("LON1") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("LON1") >>
                [entitlements[3], entitlements[5], entitlements[11], entitlements[13], entitlements[14], entitlements[15]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "comcast\tc123!EFAwefawef\tc\t1000\t1\tGroup_FOUR,Group_HEARTBEAT,Group_THREE,Group_TWO" +
                "\nadmin\ta123!EFAwefawef\ta\t2\t2\tGroup_HEARTBEAT,Group_THREE"+
                "\nreporter\tr123!EFAwefawef\tr\t2\t3\tGroup_FOUR,Group_HEARTBEAT,Group_TWO"
    }

    void "getUserConfig() should return the correct configuration file for LON2" () {
        when:
        "getUserConfig() is called on LON2"
        def result = multicastConfigResource.getUserConfig("LON2")

        then:
        "existsByCode(), findByLocation_Code(), and findByAutoAssign() are called"
        1 * multicastConfigResource.locationRepository.existsByCode("LON2") >> true
        1 * multicastConfigResource.entitlementRepository.findByLocation_Code("LON2") >>
                [entitlements[4], entitlements[6], entitlements[12], entitlements[16], entitlements[17]]
        1 * multicastConfigResource.multicastGroupRepository.findByAutoAssign(true) >>
                [groups[4]]

        and:
        "result should be the correct String"
        result ==
                "comcast\tc123!EFAwefawef\tc\t1000\t1\tGroup_FOUR,Group_HEARTBEAT,Group_TWO" +
                "\nadmin\ta123!EFAwefawef\ta\t2\t2\tGroup_FOUR,Group_HEARTBEAT,Group_TWO"+
                "\nreporter\tr123!EFAwefawef\tr\t2\t3\tGroup_FOUR,Group_HEARTBEAT,Group_TWO"
    }
}
