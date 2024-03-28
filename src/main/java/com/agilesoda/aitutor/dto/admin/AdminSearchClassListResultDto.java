package com.agilesoda.aitutor.dto.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AdminSearchClassListResultDto {
    private List<AdminClassListDto> search_list;

    @Builder
    public AdminSearchClassListResultDto(List<AdminClassListDto> search_list) {
        this.search_list = search_list;
    }

}
