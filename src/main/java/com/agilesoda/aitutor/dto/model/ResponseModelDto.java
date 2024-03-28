package com.agilesoda.aitutor.dto.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseModelDto {

    private ModelResultDto result;
    private int rsp_code;


    public ResponseModelDto(int rsp_code, ModelResultDto result) {
        this.rsp_code = rsp_code;
        this.result = result;
    }
}
