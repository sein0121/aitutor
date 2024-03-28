package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class OrgInfo {

    private String orgId; // char(6) NOT NULL 조직ID
    private String orgNm; // varchar(255) NULL 조직명
    private String createDate;

}
