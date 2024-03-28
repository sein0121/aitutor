package com.agilesoda.aitutor.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@Getter
public class UserAnswerHistory {

    private Long id; // varchar(10) NULL 테스트단계
    private Long uqhId; // char(10) NULL 문제ID
    private String qstAnswer; // timestamp NULL 진입일시
    private Timestamp createDate; // timestamp NULL 진출일시


    @Builder
    public UserAnswerHistory(Long id, Long uqhId, String qstAnswer, Timestamp createDate) {
        this.id = id;
        this.uqhId = uqhId;
        this.qstAnswer = qstAnswer;
        this.createDate = createDate;
    }
}
