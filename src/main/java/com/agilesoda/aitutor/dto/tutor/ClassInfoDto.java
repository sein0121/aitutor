package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ClassInfoDto {
    private List<StudentClassInfoDto> class_list;

    @Builder
    public ClassInfoDto (List<StudentClassInfoDto> class_list) {
        this.class_list = class_list;
    }
}
