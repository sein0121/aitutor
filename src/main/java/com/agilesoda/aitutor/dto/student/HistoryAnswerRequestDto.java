package com.agilesoda.aitutor.dto.student;

import com.agilesoda.aitutor.domain.UserQstInfo;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class HistoryAnswerRequestDto {

    private String orgId;
    private String userId;
    private String userGrd;
    private String userTestGrd;
    private String userTestLevel;
    private String qstAnswer;
    private Timestamp createDate;

    public HistoryAnswerRequestDto(){}

    public HistoryAnswerRequestDto(UserQstInfo request){
        this.orgId = request.getOrgId();
        this.userId = request.getUserId();
        this.userGrd = request.getUserGrd();
        this.userTestGrd = request.getUserTestGrd();
        this.userTestLevel = request.getUserTestLevel();
        this.qstAnswer = request.getSubmitAnswer();
        this.createDate = Timestamp.valueOf(LocalDateTime.now());
    }
}
