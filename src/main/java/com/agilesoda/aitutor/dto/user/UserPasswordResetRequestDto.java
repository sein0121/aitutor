package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPasswordResetRequestDto {

    private String user_id;
    private String org_id;
    private String reset_id;
    private String reset_pw;

    public UserPasswordResetRequestDto(String user_id, String org_id, String reset_id, String reset_pw) {
        this.user_id = user_id;
        this.org_id = org_id;
        this.reset_id = reset_id;
        this.reset_pw = reset_pw;
    }

    public UserPasswordResetRequestDto(){}

    public void encodeUserPw(String reset_pw){
        this.reset_pw = reset_pw;
    }


}
