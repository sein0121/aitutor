package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TutorMyPageResponseDto {
    private String user_nm;

    public TutorMyPageResponseDto(String user_nm) {
        this.user_nm = user_nm;
    }
}
