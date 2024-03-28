package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UserInfoHistory {

    private Long id; // BIGINT(20) ID - AUTO INCREMENT

    private String orgId; // char(10) NOT NULL 조직ID
    private String userId; // varchar(255) NOT NULL 사용자ID
    private String userType; // char(1) NOT NULL 사용자형태
    private String userGrd; // varchar(10) NULL 학년
    private String userTestGrd; // varchar(10) NULL 테스트학년
    private String classId; // char(5) NULL 클래스ID
    private String chgDate; // char(14) NULL 변경일시
    private String chgReason; // varchar(255) NULL 변경사유
    private String reqUserId; // varchar(255) NULL 변경요청ID
    private String allowUserId; // varchar(255) NULL 변경승인ID

}
