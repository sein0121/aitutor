package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@Getter
public class UserPathInfo {

    private String orgId; // char(10) NOT NULL 조직ID
    private String userId; // varchar(255) NOT NULL 사용자ID
    private String userGrd; // varchar(10) NOT NULL 학년(현재)
    private String userTestGrd; // varchar(10) NOT NULL 테스트학년
    private String userTestLevel; // char(2) NOT NULL 테스트단계
    private String next_test_list;
    private String path_nm;
    private String path_id;
    private String graph_path;
    private String userQstPath;
    private String userAnswerPath;
    private String totalTime; // timestamp NULL 테스트 경과 시간

    public UserPathInfo(String orgId, String userId, String userGrd, String userTestGrd, String userTestLevel, String userQstPath, String userAnswerPath, String totalTime) {
        this.orgId = orgId;
        this.userId = userId;
        this.userGrd = userGrd;
        this.userTestGrd = userTestGrd;
        this.userTestLevel = userTestLevel;
        this.userQstPath = userQstPath;
        this.userAnswerPath = userAnswerPath;
        this.totalTime = totalTime;
    }

    public UserPathInfo(UserQstInfo userQstInfo){
        this.orgId = userQstInfo.getOrgId();
        this.userId = userQstInfo.getUserId();
        this.userGrd = userQstInfo.getUserGrd();
        this.userTestGrd = userQstInfo.getUserTestGrd();
    }

    public void setUserTestLevel(String userTestLevel){
        this.userTestLevel = userTestLevel;
    }

    public void updateTotalTime(UserQstInfo userQstInfo, String totalTime){
        this.orgId = userQstInfo.getOrgId();
        this.userId = userQstInfo.getUserId();
        this.userGrd = userQstInfo.getUserGrd();
        this.userTestGrd = userQstInfo.getUserTestGrd();
        this.userTestLevel = userQstInfo.getUserTestLevel();
        this.totalTime = totalTime;
    }

    public void setResultPath(String userQstPath, String userAnswerPath){
        this.userQstPath = userQstPath;
        this.userAnswerPath = userAnswerPath;
    }

    public void setModelResult(String next_test_list, String path_nm, String path_id, String graph_path){
        this.next_test_list = next_test_list;
        this.path_nm = path_nm;
        this.path_id = path_id;
        this.graph_path = graph_path;
    }
}
