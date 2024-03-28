package com.agilesoda.aitutor.dto.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestFirstDto {

    private String org_id;
    private String user_id;
    private String user_test_grd;

    public RequestFirstDto(){}

    public RequestFirstDto(String org_id, String user_id, String user_test_grd) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_test_grd = user_test_grd;
    }
}
