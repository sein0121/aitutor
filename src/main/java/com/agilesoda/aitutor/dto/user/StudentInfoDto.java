package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentInfoDto {

    private String student_id;
    private String student_pw;
    private String user_type;

    public StudentInfoDto(String student_id, String student_pw, String user_type) {
        this.student_id = student_id;
        this.student_pw = student_pw;
        this.user_type = user_type;
    }

    public StudentInfoDto(){}
}
