package com.agilesoda.aitutor.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QstResultDto {

    private String qstId;
    private String submitAnswer;
    private String qstAnswer;

    public QstResultDto(){}

    public QstResultDto(String qstId, String submitAnswer, String qstAnswer) {
        this.qstId = qstId;
        this.submitAnswer = submitAnswer;
        this.qstAnswer = qstAnswer;
    }
}
