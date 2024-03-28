package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerResultDto {

    private String q_list;
    private String r_list;

    public AnswerResultDto(String q_list, String r_list) {
        this.q_list = q_list;
        this.r_list = r_list;
    }
}
