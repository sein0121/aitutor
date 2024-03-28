package com.agilesoda.aitutor.domain;


import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class BookInfo {

    private String bookId; // char(10) NOT NULL 교재ID
    private String bookNm; // varchar(255) NULL 교재명
    private String pubCoNm; // varchar(255) NULL 출판사명
    private String pubYear; // char(4) NULL 출판연도

}
