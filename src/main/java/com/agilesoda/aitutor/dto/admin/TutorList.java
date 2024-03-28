package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TutorList {

    private String teacher_id;
    private String teacher_nm;

    public TutorList(String teacher_id, String teacher_nm) {
        this.teacher_id = teacher_id;
        this.teacher_nm = teacher_nm;
    }
}
