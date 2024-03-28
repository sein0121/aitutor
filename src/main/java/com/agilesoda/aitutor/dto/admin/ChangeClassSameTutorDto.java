package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChangeClassSameTutorDto {

    private String org_id;
    private String user_type;
    private String student_id;
    private String student_grd;
    private String class_id;
    private String teacher_id;
    private String new_teacher_id;

    public ChangeClassSameTutorDto(String org_id, String user_type, String student_id, String student_grd, String class_id, String teacher_id, String new_teacher_id) {
        this.org_id = org_id;
        this.user_type= user_type;
        this.student_id = student_id;
        this.student_grd = student_grd;
        this.class_id= class_id;
        this.teacher_id= teacher_id;
        this.new_teacher_id = new_teacher_id;
    }
}
