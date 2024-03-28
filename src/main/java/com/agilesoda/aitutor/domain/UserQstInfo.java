package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UserQstInfo {

    private String orgId; // char(10) NOT NULL 조직ID
    private String userId; // varchar(255) NOT NULL 사용자ID
    private String userGrd; // varchar(10) NOT NULL 학년(현재)
    private String userTestGrd; // varchar(10) NOT NULL 테스트학년
    private String userTestLevel; // varchar(10) NOT NULL 테스트단계
    private Integer qstSeq; // int(2) NOT NULL 문제출제번호
    private String qstId; // char(10) NOT NULL 문제ID
    private String createDate; // char(5) NULL 생성일자
    private String testDate; // char(14) NULL 테스트시작일자
    private String submitDate; // char(14) NULL 체출일시
    private String chgDate; // char(14) NULL 수정일시
    private String submitAnswer; // varchar(255) NULL 제출정답
    private String tempGbn; // char(1) NULL 임시저장여부

    public UserQstInfo(String orgId, String userId, String userGrd, String userTestGrd, String userTestLevel, Integer qstSeq, String qstId, String createDate, String testDate, String submitDate, String chgDate, String submitAnswer, String tempGbn) {
        this.orgId = orgId;
        this.userId = userId;
        this.userGrd = userGrd;
        this.userTestGrd = userTestGrd;
        this.userTestLevel = userTestLevel;
        this.qstSeq = qstSeq;
        this.qstId = qstId;
        this.createDate = createDate;
        this.testDate = testDate;
        this.submitDate = submitDate;
        this.chgDate = chgDate;
        this.submitAnswer = submitAnswer;
        this.tempGbn = tempGbn;
    }

    public void setSubmitDate(String submitDate) {
        this.submitDate = submitDate;
    }

    public void setChgDate(String chgDate){
        this.chgDate = chgDate;
    }

    public void setQstInfo(int qstSeq, String qstId){
        this.qstSeq = qstSeq;
        this.qstId = qstId;
    }
}
