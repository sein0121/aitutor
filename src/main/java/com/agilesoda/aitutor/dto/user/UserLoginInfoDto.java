package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginInfoDto {

    private String user_test_level;
    private int total_time;

    public UserLoginInfoDto(String user_test_level, int total_time) {
        this.user_test_level = user_test_level;
        this.total_time = total_time;
    }
}
