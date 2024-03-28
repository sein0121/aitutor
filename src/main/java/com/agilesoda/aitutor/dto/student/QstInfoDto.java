package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QstInfoDto {

    private String qst_id;
    private String edu_level_nm;
    private String unit_nm;
    private String qst_img_file_nm;
    private String submit_answer;
    private Integer qst_seq;

    public QstInfoDto(String qst_id, String edu_level_nm, String unit_nm, String qst_img_file_nm, String submit_answer, Integer qst_seq) {
        this.qst_id = qst_id;
        this.edu_level_nm = edu_level_nm;
        this.unit_nm = unit_nm;
        this.qst_img_file_nm = qst_img_file_nm;
        this.submit_answer = submit_answer;
        this.qst_seq = qst_seq;
    }
}
