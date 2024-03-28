package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TutorStudentRequestDto {

    private String org_id;
    private String user_id;
    private String user_grd;
    private String user_test_level;

    public TutorStudentRequestDto(String org_id, String user_id, String user_grd) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
    }

    public TutorStudentRequestDto(String org_id, String user_id, String user_grd,String user_test_level) {
        this.org_id = org_id;
        this.user_id = user_id;
        this.user_grd = user_grd;
        this.user_test_level = user_test_level;
    }
}
