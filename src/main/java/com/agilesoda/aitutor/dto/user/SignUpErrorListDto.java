package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SignUpErrorListDto {

    private List<String> error_list;

    public SignUpErrorListDto(List<String> error_list) {
        this.error_list = error_list;
    }

    public SignUpErrorListDto(){}
}
