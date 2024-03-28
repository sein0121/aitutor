package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.criteria.CriteriaBuilder;

@Getter
@Setter
public class TestRateDto {
    private Integer all_qst_count;
    private Integer answer_count;
    private Integer submit_count;
    private Integer test_rate;

    public TestRateDto(Integer all_qst_count, Integer answer_count, Integer submit_count, Integer test_rate){
        this.all_qst_count = all_qst_count;
        this.answer_count = answer_count;
        this.submit_count = submit_count;

        if(submit_count / all_qst_count == 1){
            this.test_rate = 100;
        }else if(answer_count / all_qst_count < 1){
            this.test_rate =  (answer_count / all_qst_count)*100;
        }

    }
//    public void setTestRate(String all_qst_count, String answer_count, String submit_count){
//
//    }


}
