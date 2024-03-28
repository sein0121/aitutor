package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMyPageResponseDto {

    private String user_nm;
    private String class_gbn;
    private String class_nm;
    private String teacher_nm;

    public UserMyPageResponseDto(String user_nm, String class_gbn, String class_nm, String teacher_nm) {
        this.user_nm = user_nm;
        this.class_gbn = class_gbn;
        this.class_nm = class_nm;
        this.teacher_nm = teacher_nm;
    }
}
