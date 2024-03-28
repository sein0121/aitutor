package com.agilesoda.aitutor.dto.tutor;

import com.agilesoda.aitutor.dto.student.UserTestListDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentDetailDto {

    private String user_id;
    private String class_gbn;
    private String user_state;
    private String first_password;
    private String final_path_yn;
    private Object path_nm;
    private List<UserTestListDto> user_test_list;

    @Builder
    public StudentDetailDto(String user_id, String class_gbn,String user_state, String first_password, String final_path_yn, Object path_nm, List<UserTestListDto> user_test_list) {
        this.user_id = user_id;
        this.class_gbn = class_gbn;
        this.user_state = user_state;
        this.first_password = first_password;
        this.final_path_yn = final_path_yn;
        this.path_nm = path_nm;
        this.user_test_list = user_test_list;
    }
}
