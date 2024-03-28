package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerUpdateRequestDto {

    private String orgId;
    private String userId;
    private String userGrd;
    private String userTestGrd;
    private String userTestLevel;
}
