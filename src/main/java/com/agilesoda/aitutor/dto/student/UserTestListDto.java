package com.agilesoda.aitutor.dto.student;

import com.agilesoda.aitutor.repository.mapper.StudentInfoRepository;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class UserTestListDto {
        private String user_test_level;
        private String user_test_yn;
        private String test_time;
        private List<QstListDto> qst_list;

        public UserTestListDto( String user_test_level, String user_test_yn, String test_time, List<QstListDto> qst_list) {
            this.user_test_level = user_test_level;
            this.user_test_yn = user_test_yn;
            this.test_time = test_time;
            this.qst_list = qst_list;
        }
}
