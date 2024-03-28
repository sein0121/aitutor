package com.agilesoda.aitutor.dto.tutor;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentListRequestDto {
    private String org_id;
    private String user_id;

    public StudentListRequestDto(String org_id, String user_id){
        this.org_id = org_id;
        this.user_id = user_id;
    }
}
