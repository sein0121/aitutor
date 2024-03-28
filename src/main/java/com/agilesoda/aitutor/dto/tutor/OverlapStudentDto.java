package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OverlapStudentDto {

    private String student_id;
    private String used_yn;

    public OverlapStudentDto(String student_id, String used_yn) {
        this.student_id = student_id;
        this.used_yn = used_yn;
    }
}
