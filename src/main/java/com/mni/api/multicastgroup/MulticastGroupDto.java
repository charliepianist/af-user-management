package com.mni.api.multicastgroup;

import com.mni.api.validation.Ip;
import com.mni.api.validation.NoSpaces;
import com.mni.model.multicastgroup.MulticastGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.*;
import java.util.Collection;
import java.util.stream.Collectors;

@ApiModel(description = "DTO for Multicast Groups. Multicast Groups are where customers subscribe to actually receive data.")
public class MulticastGroupDto {
    @ApiModelProperty(value="Autogenerated ID for reference to multicast group (used in GET, PUT, " +
            "and DELETE requests). Attempting to set a multicast group's ID has no effect.")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @ApiModelProperty(value="Human-readable name describing the multicast group." +
            " Cannot be blank.",
            required=true,
            allowableValues = "range[1,255]",
            example="Heartbeat")
    private String name;

    @NotBlank
    @NoSpaces
    @Size(max = 255)
    @ApiModelProperty(value="Code representing the multicast group for use in " +
            "configuration files. Cannot be blank and cannot have spaces.",
            required=true,
            allowableValues = "range[1,255]",
            example="Group_HEARTBEAT")
    private String code;

    @ApiModelProperty(value="Whether a group is automatically assigned to all products. " +
            "Defaults to false, and as of initial version, is intended only for" +
            " heartbeat multicast group.")
    private boolean autoAssign;

    @NotBlank
    @Ip
    @ApiModelProperty(value="IP of multicast group. Must be four numbers from 0 to 255, " +
            "separated by periods and without leading zeroes. Used for configuration files.",
            required=true,
            example="192.168.1.1")
    private String ip;

    @NotNull
    @Min(0)
    @Max(65535)
    @ApiModelProperty(value="Port of multicast group. Must be between 0 and 65535, inclusive." +
            " Used for configuration files.",
            required=true,
            example="4000")
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
