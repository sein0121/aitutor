package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class QstInfo {

    private String qstId; // char(10) NOT NULL 문제ID
    private String qstUnitId; // char(5) NOT NULL 단원ID
    private String qstBookId; // char(5) NULL 교재ID
    private Integer qstPageNo; // int(10) NULL페이지번호
    private String qstText; // varchar(4096) NULL문제텍스트
    private String qstImgFileNm; // varchar(4096) NULL문제이미지파일명
    private String qstDiffRate; // char(1) NULL문제난이도
    private String qstAnswer; // varchar(255) NULL문제정답
    private String qstAnsType; // varchar(255) NULL정답타입
    private double qstReilability; // double NULL자기신뢰도
    private double qstReilabilityPer; // double NULL자기신뢰도비율

}
