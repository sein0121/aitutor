package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IdInfoDto {

    private List<IdListDto> id_list;

    @Builder
    public IdInfoDto(List<IdListDto> id_list){
        this.id_list = id_list;
    }
}
