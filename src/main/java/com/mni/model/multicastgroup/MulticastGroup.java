package com.mni.model.multicastgroup;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class MulticastGroup {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String ip;

    private int port;

    public MulticastGroup() {}

    public MulticastGroup(Long id, String name, String ip, int port) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.port = port;
    }
}
