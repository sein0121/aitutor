package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeleteStudentRequestDto {

    private String org_id;
    private List<String> student_id;
    private String user_id;

    public DeleteStudentRequestDto(String org_id, List<String> student_id, String user_id) {
        this.org_id = org_id;
        this.student_id = student_id;
        this.user_id = user_id;
    }
}
