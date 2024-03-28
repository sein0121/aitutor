package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminClassListDto {
    private String class_id;
    private String class_gbn;
    private String class_nm;
    private String user_nm;
    private String class_count;
    private String class_type;
    private String test_rate;
    private String create_date;

    public AdminClassListDto (String class_id, String class_gbn, String class_nm, String class_type, String create_date) {
        this.class_id = class_id;
        this.class_gbn = class_gbn;
        this.class_nm = class_nm;
        this.class_type = class_type;
        this.create_date = create_date;
    }
}
