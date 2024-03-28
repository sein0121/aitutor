package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfoRequestDto {

    private String org_id;
    private String user_id;
    private String user_state;
    private String new_pw;
    private String user_grd;
    private String user_test_grd;

    public UserInfoRequestDto(){}
}
