package com.agilesoda.aitutor.dto;

import com.agilesoda.aitutor.dto.user.OrgListResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrgListSearchResponseDto {

    private List<OrgListResponseDto> org_list;

    public OrgListSearchResponseDto(List<OrgListResponseDto> org_list) {
        this.org_list = org_list;
    }
}
