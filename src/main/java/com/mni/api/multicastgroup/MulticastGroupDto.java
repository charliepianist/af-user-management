package com.mni.api.multicastgroup;

import com.mni.model.multicastgroup.MulticastGroup;

import java.util.Collection;
import java.util.stream.Collectors;

public class MulticastGroupDto {
    private Long id;

    private String name;

    private String ip;

    private int port;

    public static MulticastGroupDto multicastGroupToMulticastGroupDto(MulticastGroup multicastGroup) {
        MulticastGroupDto multicastGroupDto = new MulticastGroupDto();
        multicastGroupDto.setId(multicastGroup.getId());
        multicastGroupDto.setIp(multicastGroup.getIp());
        multicastGroupDto.setName(multicastGroup.getName());
        multicastGroupDto.setPort(multicastGroup.getPort());
        return multicastGroupDto;
    }

    public static MulticastGroup multicastGroupDtoToMulticastGroup(MulticastGroupDto multicastGroupDto) {
        MulticastGroup multicastGroup = new MulticastGroup();
        multicastGroup.setId(multicastGroupDto.getId());
        multicastGroup.setIp(multicastGroupDto.getIp());
        multicastGroup.setName(multicastGroupDto.getName());
        multicastGroup.setPort(multicastGroupDto.getPort());
        return multicastGroup;
    }

    public static Collection<MulticastGroupDto> multicastGroupsToMulticastGroupDtos(Collection<MulticastGroup> multicastGroups) {
        return multicastGroups.stream()
                .map(m -> multicastGroupToMulticastGroupDto(m))
                .collect(Collectors.toSet());
    }

    public static Collection<MulticastGroup> multicastGroupDtosToMulticastGroups(Collection<MulticastGroupDto> multicastGroupDtos) {
        return multicastGroupDtos.stream()
                .map(m -> multicastGroupDtoToMulticastGroup(m))
                .collect(Collectors.toSet());
    }

    public MulticastGroupDto() {}

    public MulticastGroupDto(Long id, String name, String ip, int port) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.port = port;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }
}
