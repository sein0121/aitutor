package com.agilesoda.aitutor.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestDto {

    private String org_id;
    private String user_id;
    private String user_grd;
    private String user_test_grd;
    private String user_test_level;
    private String qst_id;
    private String qst_answer;
    private String total_time;

    public RequestDto(){}

    public RequestDto(String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level, String qst_id, String qst_answer, String total_time) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
        this.user_test_grd = user_test_grd;
        this.user_test_level = user_test_level;
        this.qst_id = qst_id;
        this.qst_answer = qst_answer;
        this.total_time = total_time;
    }
}
