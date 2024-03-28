package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Getter
@Setter
public class UserListDto {
    private String user_id;
    private String user_state;
    private String final_path_yn;
    private String user_test_level;
    private String user_grd;
    private String user_test_grd;
    private HashMap<String, Object> submit_answer;
    private HashMap<String, Object> qst_answer;
    private HashMap<String, Object> user_test_yn;

    public UserListDto (String user_id, String user_state, String user_grd, String user_test_grd) {
        this.user_id = user_id;
        this.user_state = user_state;
        this.user_grd = user_grd;
        this.user_test_grd = user_test_grd;
    }

    public void setUser_test_level (String user_test_level) {
        this.user_test_level = user_test_level;
    }

    public void setFinal_path_yn (String final_path_yn) {
        this.final_path_yn = final_path_yn;
    }

    public void setSubmit_answer (HashMap<String, Object> submit_answer) {
        this.submit_answer = submit_answer;
    }

    public void setQst_answer (HashMap<String, Object> qst_answer) {
        this.qst_answer = qst_answer;
    }

    public void setUser_test_yn (HashMap<String, Object> user_test_yn) { this.user_test_yn = user_test_yn; }
}
