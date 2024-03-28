package com.agilesoda.aitutor.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StudentResultRequestDto {

    private String org_id;
    private String user_id;
    private String user_grd;
    private String user_test_grd;
    private String user_test_level;

    public StudentResultRequestDto(String org_id, String user_id, String user_grd, String user_test_grd) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
        this.user_test_grd = user_test_grd;
    }

    public StudentResultRequestDto(String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
        this.user_test_grd = user_test_grd;
        this.user_test_level = user_test_level;
    }
}
