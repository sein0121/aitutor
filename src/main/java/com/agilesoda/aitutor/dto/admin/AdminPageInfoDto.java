package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminPageInfoDto {

    private List<TutorList> teacher_list;

    public AdminPageInfoDto(List<TutorList> teacher_list) {
        this.teacher_list = teacher_list;
    }

    public AdminPageInfoDto(){}
}
