package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassListDto {
    private String class_id;
    private String class_gbn;
    private String class_nm;
    private String class_count;
    private String class_type;
    private String test_rate;
    private String created_date;

    public ClassListDto(String class_id, String class_gbn, String class_nm, String class_type, String created_date) {
        this.class_id = class_id;
        this.class_gbn = class_gbn;
        this.class_nm = class_nm;
        this.class_type = class_type;
        this.created_date = created_date;
    }
}
