package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SearchClassListResultDto {
    private List<ClassListDto> search_list;

    @Builder
    public SearchClassListResultDto(List<ClassListDto> search_list) {
        this.search_list = search_list;
    }
}
