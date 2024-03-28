package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ClassInfo {

    private String orgId; // char(10) NOT NULL 조직ID (org_info -> org_id)
    private String classId; // varchar(255) NOT NULL 클래스ID
    private String classNm; // varchar(255) NOT NULL 클래스명 (class_id와 동일)
    private String classGbn; // char(2) NOT NULL 클래스구분
    private String mgrId; // varchar(255) NOT NULL 관리자ID(user_info -> 사용자ID)
    private String userGrd;
    private String userTestGrd;
    private String classState; // char(1) NOT NULL 사용여부
    private String createDate;

}
