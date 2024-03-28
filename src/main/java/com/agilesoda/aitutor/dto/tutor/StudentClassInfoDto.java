package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentClassInfoDto {
    private String class_gbn;
    private String class_id;

    public StudentClassInfoDto(String class_gbn, String class_id) {
        this.class_gbn = class_gbn;
        this.class_id = class_id;
    }
}
