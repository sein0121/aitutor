package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class UnitInfo {

    private String unitId; // char(10) NOT NULL 단원ID
    private String unitNm; // varchar(255) NULL 단원명
    private String upUnitId;    // char(5) NULL 상위단원명
    private String eduLevelNm;  // varchar(255) Null 교육과정단계명
}
