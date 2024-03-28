package com.agilesoda.aitutor.dto.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminClassChangeInfoDto {
    private String class_id;
    private String teacher_id;
    private String teacher_nm;
    private String class_gbn;
    private String class_state;

    public AdminClassChangeInfoDto(String class_id, String teacher_id, String teacher_nm, String class_gbn, String class_state){
        this.class_id = class_id;
        this.teacher_id = teacher_id;
        this.teacher_nm = teacher_nm;
        this.class_gbn = class_gbn;
        this.class_state = class_state;
    }
}
