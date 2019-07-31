package com.mni.api.multicastgroup;

import com.mni.api.NoSpaces;
import com.mni.model.multicastgroup.MulticastGroup;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.stream.Collectors;

public class MulticastGroupDto {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @NoSpaces
    private String code;

    private boolean autoAssign;

    @NotBlank
    private String ip;

    @NotNull
    private Integer port;

    public static MulticastGroupDto translateMulticastGroupToMulticastGroupDto(MulticastGroup multicastGroup) {
        MulticastGroupDto multicastGroupDto = new MulticastGroupDto();
        multicastGroupDto.setId(multicastGroup.getId());
        multicastGroupDto.setIp(multicastGroup.getIp());
        multicastGroupDto.setName(multicastGroup.getName());
        multicastGroupDto.setCode(multicastGroup.getCode());
        multicastGroupDto.setAutoAssign(multicastGroup.isAutoAssign());
        multicastGroupDto.setPort(multicastGroup.getPort());
        return multicastGroupDto;
    }

    public static MulticastGroup translateMulticastGroupDtoToMulticastGroup(MulticastGroupDto multicastGroupDto) {
        MulticastGroup multicastGroup = new MulticastGroup();
        multicastGroup.setId(multicastGroupDto.getId());
        multicastGroup.setIp(multicastGroupDto.getIp());
        multicastGroup.setName(multicastGroupDto.getName());
        multicastGroup.setCode(multicastGroupDto.getCode());
        multicastGroup.setAutoAssign(multicastGroupDto.isAutoAssign());
        multicastGroup.setPort(multicastGroupDto.getPort());
        return multicastGroup;
    }

    public static Collection<MulticastGroupDto> multicastGroupsToMulticastGroupDtos(Collection<MulticastGroup> multicastGroups) {
        return multicastGroups.stream()
                .map(m -> translateMulticastGroupToMulticastGroupDto(m))
                .collect(Collectors.toSet());
    }

    public static Collection<MulticastGroup> multicastGroupDtosToMulticastGroups(Collection<MulticastGroupDto> multicastGroupDtos) {
        return multicastGroupDtos.stream()
                .map(m -> translateMulticastGroupDtoToMulticastGroup(m))
                .collect(Collectors.toSet());
    }

    public MulticastGroupDto() {}

    public MulticastGroupDto(Long id, String name, String code, boolean autoAssign, String ip, Integer port) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.autoAssign = autoAssign;
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

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isAutoAssign() {
        return autoAssign;
    }

    public void setAutoAssign(boolean autoAssign) {
        this.autoAssign = autoAssign;
    }

    @Override
    public String toString() {
        return "MulticastGroupDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", autoAssign=" + autoAssign +
                ", ip='" + ip + '\'' +
                ", port=" + port +
                '}';
    }
}
