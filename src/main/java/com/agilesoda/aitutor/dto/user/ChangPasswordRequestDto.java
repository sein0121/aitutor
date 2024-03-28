package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangPasswordRequestDto {

    private String org_id;
    private String user_id;
    private String user_grd;
    private String user_test_grd;
    private String user_nm;
    private String user_pw_now;
    private String user_pw_new;

    public ChangPasswordRequestDto(String org_id, String user_id, String user_grd, String user_test_grd, String user_nm, String user_pw_now, String user_pw_new) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
        this.user_test_grd = user_test_grd;
        this.user_nm = user_nm;
        this.user_pw_now = user_pw_now;
        this.user_pw_new = user_pw_new;
    }
}
