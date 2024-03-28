package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QstListDto {
    private String qst_id;
    private String unit_nm;
    private String submit_answer;
    private String qst_answer;
    private String qst_img_file_nm;
    private String edu_level_nm;

    public QstListDto(String qst_id, String unit_nm, String submit_answer, String qst_answer, String qst_img_file_nm, String edu_level_nm) {
        this.qst_id = qst_id;
        this.unit_nm = unit_nm;
        this.submit_answer = submit_answer;
        this.qst_answer = qst_answer;
        this.qst_img_file_nm = qst_img_file_nm;
        this.edu_level_nm = edu_level_nm;
    }
}
