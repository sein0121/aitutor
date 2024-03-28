package com.agilesoda.aitutor.dto.tutor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClassDetailInfoDto {
    private String class_id;
    private String class_nm;
    private String class_gbn;
    private String class_count;
    private String test_rate;
    private List<UserListDto> user_list;

    public ClassDetailInfoDto(String class_id, String class_nm, String class_gbn) {
        this.class_id = class_id;
        this.class_nm = class_nm;
        this.class_gbn = class_gbn;
    }

    @Builder
    public ClassDetailInfoDto(String class_id, String class_nm, String class_gbn, String class_count, String test_rate, List<UserListDto> user_list) {
        this.class_id = class_id;
        this.class_nm = class_nm;
        this.class_gbn = class_gbn;
        this.class_count = class_count;
        this.test_rate = test_rate;
        this.user_list = user_list;
    }
}
