package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupListResponseDto {

    private List<SuperAdminOrgListDto> org_list;

    public GroupListResponseDto(List<SuperAdminOrgListDto> org_list) {
        this.org_list = org_list;
    }

    public GroupListResponseDto(){}
}
