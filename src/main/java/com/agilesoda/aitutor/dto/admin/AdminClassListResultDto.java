package com.agilesoda.aitutor.dto.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AdminClassListResultDto {
    private List<AdminClassListDto> class_list;

    @Builder
    public AdminClassListResultDto(List<AdminClassListDto> class_list) {
        this.class_list = class_list;
    }

}
