package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SuperAdminRequestDto {

    private String user_id;
    private List<OrgListDto> modify_list;


}
