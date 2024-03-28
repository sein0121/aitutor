package com.agilesoda.aitutor.dto.student;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentResultDto {

    private String final_path_yn;
    private Object path_nm;
    private List<UserTestListDto> user_test_list;

    @Builder
    public StudentResultDto(String final_path_yn, Object path_nm, List<UserTestListDto> user_test_list) {
        this.final_path_yn = final_path_yn;
        this.path_nm = path_nm;
        this.user_test_list = user_test_list;
    }
}
