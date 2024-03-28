package com.agilesoda.aitutor.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDto {

    private String orgId; // char(10) NOT NULL조직ID
    private String userId; // varchar(255) NOT NULL 사용자ID
    private String userType; // char(2) NOT NULL 사용자형태
    private String userNm; // varchar(255) NULL 사용자이름
    private String userGrd; // varchar(10) NULL 학년(현재)
    private String userTestGrd; // varchar(10) NULL 테스트학년(현재)
    private String classId; // char(5) NULL 클래스ID
    private String email; // varchar(255) NULL 패스워드
    private String password; // varchar(255) NULL 이메일
    private String userPhone; // varchar(255) NULL 전화번호
    private String userState; // char(1) NULL 상태
    private String auth;

    public UserInfoDto(UserSignRequestDto request) {
        this.orgId = request.getOrg_id();
        this.userNm = request.getUser_nm();
        this.classId = request.getClass_id();
        this.email = request.getUser_email();
        this.userPhone = request.getUser_phone();
    }

    public void setSignInfo(String userId, String password, String userType, String userGrd, String userTestGrd, String auth) {
        this.userId = userId;
        this.password = password;
        this.userType = userType;
        this.userGrd = userGrd;
        this.userTestGrd = userTestGrd;
        this.userState = "1";
        this.auth = auth;
    }
}
