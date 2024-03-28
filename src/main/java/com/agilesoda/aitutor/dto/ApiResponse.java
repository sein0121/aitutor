package com.agilesoda.aitutor.dto;

import lombok.Getter;
import lombok.Setter;

/* API Response Dto */
@Getter
@Setter
public class ApiResponse {

    private int rsp_code;
    private Object result;

    public ApiResponse(int rsp_code, Object result){
        this.rsp_code = rsp_code;
        this.result = result;
    }
}
