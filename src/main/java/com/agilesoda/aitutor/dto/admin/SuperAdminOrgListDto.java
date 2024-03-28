package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SuperAdminOrgListDto {

    private String org_id;
    private String org_nm;
    private List<SuperAdminUserDto> user_list;

    public SuperAdminOrgListDto(String org_id, String org_nm, List<SuperAdminUserDto> user_list) {
        this.org_id = org_id;
        this.org_nm = org_nm;
        this.user_list = user_list;
    }

    public SuperAdminOrgListDto(){}
}
