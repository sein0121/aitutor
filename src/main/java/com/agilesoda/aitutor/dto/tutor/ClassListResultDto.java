package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClassListResultDto {
    private List<ClassListDto> class_list;

    @Builder
    public ClassListResultDto(List<ClassListDto> class_list) {
        this.class_list = class_list;
    }
}
