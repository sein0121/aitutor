package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeleteClassRequestDto {

    private String org_id;
    private List<String> class_id;
    private String user_id;

    public DeleteClassRequestDto(String org_id, List<String> class_id, String user_id) {
        this.org_id = org_id;
        this.class_id = class_id;
        this.user_id = user_id;
    }
}
