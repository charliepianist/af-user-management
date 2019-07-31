package com.mni;

import com.mni.model.customer.Customer;
import com.mni.model.customer.CustomerRepository;
import com.mni.model.entitlement.Entitlement;
import com.mni.model.entitlement.EntitlementRepository;
import com.mni.model.location.Location;
import com.mni.model.location.LocationRepository;
import com.mni.model.multicastgroup.MulticastGroup;
import com.mni.model.multicastgroup.MulticastGroupRepository;
import com.mni.model.product.Product;
import com.mni.model.product.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by will.schick on 6/17/19.
 */
@SpringBootApplication
public class Application {


    private static final Logger logger = LoggerFactory.getLogger(Application.class);


    @Autowired CustomerRepository customerRepository;
    @Autowired ProductRepository productRepository;
    @Autowired LocationRepository locationRepository;
    @Autowired EntitlementRepository entitlementRepository;
    @Autowired MulticastGroupRepository multicastGroupRepository;

    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner startup(){
        return strings -> {

            logger.info("Initializing Test Data.");
            initTestData();

            new ProcessBuilder()
                    .directory(new File("ui"))
                    .command("npm","install")
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .start()
                    .waitFor();

            new ProcessBuilder()
                    .directory(new File("ui"))
                    .command("ng","serve","--proxy-config","proxy.conf.json")
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .start();

        };
    }

    private void initTestData() {
        // input IDs are arbitrary, Spring generates them when saving

        // ===================== MulticastGroup setup =======================
        ArrayList<MulticastGroup> multicastGroupsA = new ArrayList<>();
        ArrayList<MulticastGroup> multicastGroupsB = new ArrayList<>();
        MulticastGroup multicastGroup1 = multicastGroupRepository.save(
                new MulticastGroup(11L, "Test Multicast 1", "Group_TEST_ONE", false, "192.168.1.1", 1001));
        MulticastGroup multicastGroup2 = multicastGroupRepository.save(
                new MulticastGroup(12L, "Test Multicast 2", "Group_TEST_TWO", false, "192.168.1.2", 1002));
        MulticastGroup multicastGroup3 = multicastGroupRepository.save(
                new MulticastGroup(13L, "Test Multicast 3", "Group_TEST_THREE", false, "192.168.1.3", 1003));
        MulticastGroup multicastGroup4 = multicastGroupRepository.save(
                new MulticastGroup(14L, "Heartbeat", "Group_HEARTBEAT", true, "192.168.1.4", 1004));
        multicastGroupsA.add(multicastGroup1);
        multicastGroupsA.add(multicastGroup3);
        multicastGroupsB.add(multicastGroup2);
        multicastGroupsB.add(multicastGroup3);

        // ======================= Product Setup ===========================
        Product usData = productRepository.save(
                new Product(101L, "US Data", multicastGroupsA));
        Product doeData = productRepository.save(
                new Product(102L, "DOE Data", multicastGroupsA));
        Product dolData = productRepository.save(
                new Product(103L, "DOL Data", multicastGroupsA));
        Product forexData = productRepository.save(
                new Product(104L, "Forex Data", multicastGroupsB));
        Product euData = productRepository.save(
                new Product(105L, "EU Data", multicastGroupsB));
        for(int i = 0; i < 15; i++) {
            productRepository.save(new Product(null, "Filler " + i, multicastGroupsA));
        }

        // ======================= Location Setup ===========================
        Location nyc1 = locationRepository.save(
                new Location(1001L, "NYC1", "New York 1"));
        Location nyc2 = locationRepository.save(
                new Location(1002L, "NYC2", "New York 2"));
        Location frk1 = locationRepository.save(
                new Location(1003L, "FRK1", "Frankfurt 1"));
        Location frk2 = locationRepository.save(
                new Location(1004L, "FRK2", "Frankfurt 2"));
        Location frk3 = locationRepository.save(
                new Location(1005L, "FRK3", "Frankfurt 3"));
        Location lon1 = locationRepository.save(
                new Location(1006L, "LON1", "London 1"));
        Location lon2 = locationRepository.save(
                new Location(1007L, "LON2", "London 2"));
        Location lon3 = locationRepository.save(
                new Location(1008L, "LON3", "London 3"));

        // ================= Customer & Entitlement Setup =====================
        Customer acme = customerRepository.save(
                new Customer(10001L, "ACME", "acme",
                "a@e!E2r39#rErB$", 'c', 1, new ArrayList()));
        Customer bofa = customerRepository.save(
                new Customer(10002L, "Bank of America", "bofa",
                "b@e!E2r39#rErB$", 'c', 1, new ArrayList()));
        Customer comcast = customerRepository.save(
                new Customer(10003L, "Comcast", "comcast",
                "c@e!E2r39#rErB$", 'c', 1, new ArrayList()));
        Customer dell = customerRepository.save(
                new Customer(10004L, "Dell", "dell",
                "d@e!E2r39#rErB$", 'c', 1, new ArrayList()));
        
        // ====================== Entitlement Setup =========================
        Date now = new Date();
        long oneDay = 1000 * 60 * 60 * 24;
        java.sql.Date inADay = new java.sql.Date(now.getTime() + oneDay);
        java.sql.Date inAWeek = new java.sql.Date(now.getTime() + 7 * oneDay);
        java.sql.Date inAMonth = new java.sql.Date(now.getTime() + 30 * oneDay);
        java.sql.Date inFourMonths = new java.sql.Date(now.getTime() + 120 * oneDay);
        ArrayList<Entitlement> acmeEntitlements = new ArrayList<>();
        ArrayList<Entitlement> bofaEntitlements = new ArrayList<>();
        ArrayList<Entitlement> comcastEntitlements = new ArrayList<>();
        ArrayList<Entitlement> dellEntitlements = new ArrayList<>();
        Entitlement acmeUs = entitlementRepository.save(
                new Entitlement(100001L, usData, nyc1, acme, 2, inADay));
        Entitlement acmeDoe = entitlementRepository.save(
                new Entitlement(100002L, doeData, nyc1, acme, 2, inAWeek));
        Entitlement acmeDol = entitlementRepository.save(
                new Entitlement(100003L, forexData, nyc2, acme, 2, inAWeek));
        Entitlement acmeEu = entitlementRepository.save(
                new Entitlement(100004L, euData, lon1, acme, 2));
        Entitlement acmeForex = entitlementRepository.save(
                new Entitlement(100005L, forexData, lon2, acme, 3));
        acmeEntitlements.add(acmeUs);
        acmeEntitlements.add(acmeDoe);
        acmeEntitlements.add(acmeDol);
        acmeEntitlements.add(acmeEu);
        acmeEntitlements.add(acmeForex);
        acme.setEntitlements(acmeEntitlements);
        acme = customerRepository.save(acme);

        Entitlement bofaUs = entitlementRepository.save(
                new Entitlement(100006L, usData, nyc1, bofa, 2, inAMonth));
        Entitlement bofaDol = entitlementRepository.save(
                new Entitlement(100007L, dolData, nyc2, bofa, 2, inFourMonths));
        Entitlement bofaForex = entitlementRepository.save(
                new Entitlement(100008L, forexData, lon1, bofa, 3));
        Entitlement bofaForex2 = entitlementRepository.save(
                new Entitlement(100009L, forexData, nyc2, bofa, 2, inFourMonths));
        bofaEntitlements.add(bofaUs);
        bofaEntitlements.add(bofaDol);
        bofaEntitlements.add(bofaForex);
        bofaEntitlements.add(bofaForex2);
        bofa.setEntitlements(bofaEntitlements);
        bofa = customerRepository.save(bofa);

        Entitlement comcastUs = entitlementRepository.save(
                new Entitlement(100009L, usData, frk1, comcast, 2));
        Entitlement comcastDol = entitlementRepository.save(
                new Entitlement(100010L, dolData, frk1, comcast, 2));
        Entitlement comcastDoe = entitlementRepository.save(
                new Entitlement(100011L, doeData, nyc1, comcast, 3));
        comcastEntitlements.add(comcastUs);
        comcastEntitlements.add(comcastDol);
        comcastEntitlements.add(comcastDoe);
        comcast.setEntitlements(comcastEntitlements);
        comcast = customerRepository.save(comcast);

        Entitlement dellUs = entitlementRepository.save(
                new Entitlement(100009L, usData, nyc2, dell, 2));
        Entitlement dellDol = entitlementRepository.save(
                new Entitlement(100010L, dolData, nyc1, dell, 2, inAWeek));
        Entitlement dellDoe = entitlementRepository.save(
                new Entitlement(100011L, doeData, frk1, dell, 2, inAWeek));
        Entitlement dellForex = entitlementRepository.save(
                new Entitlement(100012L, forexData, lon2, dell, 3, inAMonth));
        dellEntitlements.add(dellUs);
        dellEntitlements.add(dellDol);
        dellEntitlements.add(dellDoe);
        dellEntitlements.add(dellForex);
        dell.setEntitlements(dellEntitlements);
        dell = customerRepository.save(dell);
    }
}
