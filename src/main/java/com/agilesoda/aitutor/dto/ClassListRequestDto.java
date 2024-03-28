package com.agilesoda.aitutor.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassListRequestDto {

    private String org_id;
    private String class_id;
    private String user_type;

    public ClassListRequestDto(String org_id, String class_id, String user_type) {
        this.org_id = org_id;
        this.class_id = class_id;
        this.user_type = user_type;
    }
}
