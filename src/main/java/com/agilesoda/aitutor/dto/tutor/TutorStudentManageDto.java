package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class TutorStudentManageDto {
    private List<StudentListDto> student_list;

    @Builder
    public TutorStudentManageDto(List<StudentListDto> student_list){
        this.student_list = student_list;
    }


}
