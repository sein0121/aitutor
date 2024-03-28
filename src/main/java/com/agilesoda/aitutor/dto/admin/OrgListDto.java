package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrgListDto {

    private String org_id;
    private String org_nm;

    public OrgListDto(String org_id, String org_nm) {
        this.org_id = org_id;
        this.org_nm = org_nm;
    }
}
