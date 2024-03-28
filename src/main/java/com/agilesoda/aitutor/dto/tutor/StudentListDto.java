package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class StudentListDto {
    private String org_id; // char(10) NOT NULL조직ID
    private String student_id; // varchar(255) NOT NULL 사용자ID
    private String user_grd; // varchar(10) NULL 학년(현재)
    private String user_state; // char(1) NULL 상태
    private String class_nm;
    private String create_date;
    private String user_qst_level;
    private Integer all_qst_count; //전체 문항 수
    private Integer answer_count; //temp_gbn = 0인 문항 수
    private Integer submit_count; //temp_gbn = 1인 문항 수
    private Integer test_rate ;

    public StudentListDto(String org_id, String user_id, String user_grd, String user_state, String class_nm, String create_date,  String user_test_level,Integer all_qst_count, Integer answer_count , Integer submit_count, Integer test_rate) {
        this.org_id = org_id;
        this.student_id = user_id;
        this.user_grd = user_grd;
        this.user_state = user_state;
        this.class_nm = class_nm;
        this.create_date = create_date;
        this.user_qst_level = user_test_level;
        this.all_qst_count = all_qst_count;
        this.answer_count = answer_count;
        this.submit_count = submit_count;

        //진행률 계산
        if(submit_count/all_qst_count==1 && answer_count == 0){
            this.test_rate = 100;
        }else if (answer_count/(all_qst_count-submit_count) == 1 ){
            this.test_rate = 99;
        }else if(answer_count==0 && submit_count ==0){
            this.test_rate = 0;
        }else if (answer_count/all_qst_count<1 ) {
            this.test_rate = (int) Math.floor((answer_count / (float) (all_qst_count-submit_count) * 100));
        }else if (all_qst_count>submit_count && answer_count ==0){
            this.test_rate = 0;
        }
    }


}
