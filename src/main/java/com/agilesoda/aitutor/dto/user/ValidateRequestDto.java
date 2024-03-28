package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidateRequestDto {
    private String org_id;
    private String user_id;
    private String user_grd;
    private String user_test_grd;
    private String user_pw;
}
