package com.agilesoda.aitutor.dto.user;

import com.agilesoda.aitutor.dto.tutor.OverlapStudentDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentNameResponseDto {

    private List<OverlapStudentDto> student_list;

    public StudentNameResponseDto(List<OverlapStudentDto> student_list) {
        this.student_list = student_list;
    }

    public StudentNameResponseDto(){}
}
