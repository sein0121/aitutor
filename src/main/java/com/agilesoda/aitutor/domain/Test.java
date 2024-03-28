package com.agilesoda.aitutor.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
public class Test {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "grade")
    private Integer grade;

    @Column(name = "email")
    private String email;

    public Test(String id, Integer grade, String email) {
        this.id = id;
        this.grade = grade;
        this.email = email;
    }
}
