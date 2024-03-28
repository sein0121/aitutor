package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrgListResponseDto {

    private String org_id;
    private String org_nm;

    public OrgListResponseDto(String org_id, String org_nm) {
        this.org_id = org_id;
        this.org_nm = org_nm;
    }
}
