package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AllGraphDto {
    private String org_id;
    private String user_id;

    public AllGraphDto(String org_id,String user_id){
        this.org_id = org_id;
        this.user_id = user_id;
    }
}
