package com.agilesoda.aitutor.dto.tutor;

import com.agilesoda.aitutor.config.util.DateTimeHelper;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InsertClassRequestDto {
    private String org_id;
    private String class_id;
    private String class_nm;
    private String class_gbn;
    private String mgr_id;
    private String user_grd;
    private String user_test_grd;
    private String class_state;
    private String created_date;

    public InsertClassRequestDto (String org_id, String class_id, String class_gbn, String mgr_id, String class_state) {
        this.org_id = org_id;
        this.class_id = class_id;
        this.class_nm = class_id;
        this.class_gbn = class_gbn;
        this.mgr_id = mgr_id;
        this.user_grd = class_gbn;
        this.class_state = class_state;
        this.created_date = DateTimeHelper.getDateTimeNow();
    }
}
