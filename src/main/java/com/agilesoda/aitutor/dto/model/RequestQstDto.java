package com.agilesoda.aitutor.dto.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestQstDto {

    private String org_id;
    private String user_id;
    private String user_test_grd;
    private String user_test_level;
    private List<String> q_list;
    private List<Integer> r_list;

    public RequestQstDto(){}

    public RequestQstDto(String org_id, String user_id, String user_test_grd, String user_test_level, List<String> q_list, List<Integer> r_list) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_test_grd = user_test_grd;
        this.user_test_level = user_test_level;
        this.q_list = q_list;
        this.r_list = r_list;
    }
}
