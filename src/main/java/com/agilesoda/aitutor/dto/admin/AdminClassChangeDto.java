package com.agilesoda.aitutor.dto.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminClassChangeDto {
    private List<AdminClassChangeInfoDto> class_list;

    @Builder
    public AdminClassChangeDto(List<AdminClassChangeInfoDto> class_list){
        this.class_list=class_list;
    }
}
