package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@Getter
public class UserQstHistory {

    private Long id; // BIGINT(20) ID - AUTO INCREMENT

    private String orgId; // char(10) NULL 조직ID
    private String userId; // varchar(255) NULL 사용자ID
    private String userGrd; // varchar(10) NULL 학년(현재)
    private String userTestGrd; // varchar(10) NOT NULL 테스트학년
    private String userTestLevel; // varchar(10) NULL 테스트단계
    private String qstId; // char(10) NULL 문제ID
    private Timestamp inDate; // timestamp NULL 진입일시
    private Timestamp outDate; // timestamp NULL 진출일시
    private String chgYn; // char(2) NULL 수정여부

    public UserQstHistory(String orgId, String userId, String userGrd, String userTestGrd, String userTestLevel, String qstId, Timestamp inDate, Timestamp outDate, String chgYn) {
        this.orgId = orgId;
        this.userId = userId;
        this.userGrd = userGrd;
        this.userTestGrd = userTestGrd;
        this.userTestLevel = userTestLevel;
        this.qstId = qstId;
        this.inDate = inDate;
        this.outDate = outDate;
        this.chgYn = chgYn;
    }

    public void setChgYn(UserQstInfo userQstInfo){
        this.orgId = userQstInfo.getOrgId();
        this.userId = userQstInfo.getUserId();
        this.userGrd = userQstInfo.getUserGrd();
        this.userTestGrd = userQstInfo.getUserTestGrd();
        this.userTestLevel = userQstInfo.getUserTestLevel();
        this.qstId = userQstInfo.getQstId();
        this.chgYn = "y";
    }
}
