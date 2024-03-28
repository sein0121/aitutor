package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClassListSearchResultDto {
    private List<ClassListDto> search_list;

    public ClassListSearchResultDto(List<ClassListDto> search_list) {
        this.search_list = search_list;
    }
}
