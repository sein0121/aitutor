package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResetPasswordRequestDto {

    private String org_id;
    private List<ResetUserInfo> user_list;

    public ResetPasswordRequestDto(){}
}
