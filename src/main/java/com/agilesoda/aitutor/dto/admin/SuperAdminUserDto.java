package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuperAdminUserDto {

    private String user_id;
    private String user_type;
    private String user_nm;

    public SuperAdminUserDto(String user_id, String user_type, String user_nm) {
        this.user_id = user_id;
        this.user_type = user_type;
        this.user_nm = user_nm;
    }
}
