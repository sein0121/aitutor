package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TutorStudentSearchDto {
    private List<StudentListDto> search_list;

    public TutorStudentSearchDto(){}
    @Builder
    public TutorStudentSearchDto(List<StudentListDto> search_list){
        this.search_list = search_list;
    }

}
