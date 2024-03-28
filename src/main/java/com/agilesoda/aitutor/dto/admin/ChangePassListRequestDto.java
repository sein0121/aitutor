package com.agilesoda.aitutor.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChangePassListRequestDto {
    private String org_id;
    private String user_id;
    List<ChangeTutorDto> teacher_list;

}
