package com.agilesoda.aitutor.dto.student;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccessTestPageDto {

    private List<QstInfoDto> qst_list;
    private Integer start_qst;
    private Integer total_time;

    public AccessTestPageDto(){}

    @Builder
    public AccessTestPageDto(List<QstInfoDto> qst_list, Integer start_qst, Integer total_time) {
        this.qst_list = qst_list;
        this.start_qst = start_qst;
        this.total_time = total_time;
    }
}
