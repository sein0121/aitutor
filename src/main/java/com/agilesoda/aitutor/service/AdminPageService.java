package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.PasswordHelper;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.admin.ChangeTutorDto;
import com.agilesoda.aitutor.dto.admin.TutorList;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminPageService {

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    public List<TutorList> getTutorInfo(String org_id, String user_type){
        return userInfoMapperRepository.selectTutorInfo(org_id, user_type);
    }

    public List<String> updateTutorPw(String org_id, List<ChangeTutorDto> teacher_list) {

        List<String> errorList = new ArrayList<>();

        try {

            for(ChangeTutorDto dto : teacher_list){
                int result = userInfoMapperRepository.updatePassword(
                        UserInfo.builder()
                                .orgId(org_id)
                                .userId(dto.getTeacher_id())
                                .password(PasswordHelper.encodePassword(dto.getTeacher_new_pw()))
                                .build());

                if(result == 0){
                    errorList.add(dto.getTeacher_id());
                }
            }

        }catch (Exception e){
            return null;
        }
            return errorList;
    }
}
