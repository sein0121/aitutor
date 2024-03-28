package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.PasswordHelper;
import com.agilesoda.aitutor.domain.ClassInfo;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.student.UserMyPageResponseDto;
import com.agilesoda.aitutor.dto.tutor.TutorMyPageResponseDto;
import com.agilesoda.aitutor.dto.user.*;
import com.agilesoda.aitutor.repository.mapper.ClassInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    TutorStudentManagementService tutorStudentManagementService;

    @Autowired
    ClassInfoRepository classInfoRepository;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;


    public UserMyPageResponseDto getMyPageInfo(UserInfo userInfo) {

        HashMap<String, Object> hashMap = userInfoMapperRepository.selectUserName(userInfo);
        ClassInfo classInfo = classInfoRepository.selectClassInfo(userInfo.getOrgId(), (String) hashMap.get("class_id"));
        String teacher_nm = userInfoMapperRepository.selectTeacherName(userInfo.getOrgId(), classInfo.getMgrId(), AppConstant.USER_TYPE_TUTOR);

        return new UserMyPageResponseDto((String) hashMap.get("user_nm"), classInfo.getClassGbn(), classInfo.getClassNm(), teacher_nm);
    }

    public int changePassword(UserInfo userInfo, String user_pw_now, String user_pw_new) {

        String originPw = userInfoMapperRepository.selectUserPassword(userInfo);

        if (PasswordHelper.match(user_pw_now, originPw)) {
            userInfo.setPassword(PasswordHelper.encodePassword(user_pw_new));
            if(0 < userInfoMapperRepository.updatePassword(userInfo)){
                return AppConstant.RESPONSE_PW_SUCCESS;
            } else{
                return AppConstant.RESPONSE_ERROR;
            }
        } else {
            return AppConstant.RESPONSE_PW_FAIL;
        }

    }

    public int resetPassword(ResetPasswordRequestDto request){
        for(ResetUserInfo dto : request.getUser_list()){
            userInfoMapperRepository.resetPassword(request.getOrg_id(), dto.getUser_id(), PasswordHelper.encodePassword(dto.getUser_pw()));
        }
        return AppConstant.RESPONSE_SUCCESS;
    }

    // 계정 등록 (usertype : 30(학생) / 20(교사) / 10(학교관리자) / 00(관리자))
    public List<String> createUserInfo(UserSignRequestDto request) {

        List<String> errorList = new ArrayList<>();
        // auth 구하기(user_type),
        UserInfoDto userInfoDto = new UserInfoDto(request);
        try {

            for (StudentInfoDto dto : request.getStudent_list()) {
                ClassInfo classInfo = classInfoRepository.selectClassInfo(request.getOrg_id(), request.getClass_id());
                userInfoDto.setSignInfo(dto.getStudent_id(), dto.getStudent_pw(), dto.getUser_type(), classInfo.getUserGrd(), classInfo.getUserTestGrd(), getAuthName(dto.getUser_type()));
                signup(userInfoDto, request.getUser_id(), errorList);

            }

            return errorList;
        } catch (Exception e) {
            return errorList;
        }

    }

    public void signup(UserInfoDto userInfoDto, String mgrId, List<String> errorList) {

        if (!userInfoService.save(userInfoDto).equals(userInfoDto.getOrgId()+"/"+userInfoDto.getUserId())) {
            errorList.add(userInfoDto.getUserId());
        } else {
            if (userInfoDto.getUserType().equals(AppConstant.USER_TYPE_STUDENT)) {
                try {
                    int result = tutorStudentManagementService.setFirstQstInfo(userInfoDto);
                    if (result == AppConstant.RESPONSE_ERROR) {
                        throw new Exception();
                    }
                } catch (Exception e) {
                    deleteExceptionData(userInfoDto, mgrId);
                    errorList.add(userInfoDto.getUserId());
                }

            }
        }

    }

    public void deleteExceptionData(UserInfoDto userInfoDto, String mgrId){
        userQstInfoRepository.deleteExceptionData(userInfoDto.getOrgId(), userInfoDto.getUserId(), userInfoDto.getUserGrd(), userInfoDto.getUserTestGrd());
        userPathInfoRepository.deleteExceptionData(userInfoDto.getOrgId(), userInfoDto.getUserId(), userInfoDto.getUserGrd(), userInfoDto.getUserTestGrd());
        userInfoMapperRepository.deleteStudent(userInfoDto.getOrgId(), userInfoDto.getUserId(), mgrId);
    }



    public String getAuthName(String userType) {
        if (userType.equals("30")) {
            return "ROLE_USER";
        } else if (userType.equals("20")) {
            return "ROLE_TUTOR";
        } else if (userType.equals("10")) {
            return "ROLE_ADMIN";
        } else if (userType.equals("00")) {
            return "ROLE_SUPER";
        }
        return null;
    }

    public TutorMyPageResponseDto getTutorName(UserInfo userInfo) {
        return userInfoMapperRepository.selectTutorName(userInfo);
    }

    public int validateName(String org_id, String user_name) {
        if(0 < userInfoMapperRepository.selectUserNameCount(org_id, user_name)){
            return AppConstant.RESPONSE_DISABLE;
        }
        return AppConstant.RESPONSE_ENABLE;
    }
}
