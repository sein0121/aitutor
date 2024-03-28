package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OverlapStudentRequestDto {

    private String org_id;
    private String class_id;
    private List<String> student_list;

    public OverlapStudentRequestDto(String org_id, String class_id, List<String> student_list) {
        this.org_id = org_id;
        this.class_id = class_id;
        this.student_list = student_list;
    }
}
