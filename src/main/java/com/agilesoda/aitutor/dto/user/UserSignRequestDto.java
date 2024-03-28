package com.agilesoda.aitutor.dto.user;

import com.agilesoda.aitutor.dto.tutor.StudentClassInfoDto;
import com.agilesoda.aitutor.dto.tutor.StudentListDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserSignRequestDto {

    private String org_id;
    private String user_id;
    private String class_id;
    private String user_nm;
    private String user_email;
    private String user_phone;
    private List<StudentInfoDto> student_list;

    public UserSignRequestDto(String org_id, String user_id, String class_id, List<StudentInfoDto> student_list) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.class_id = class_id;
        this.student_list = student_list;
    }
}
