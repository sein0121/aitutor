package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.student.UserMyPageResponseDto;
import com.agilesoda.aitutor.dto.user.*;
import com.agilesoda.aitutor.service.TutorStudentManagementService;
import com.agilesoda.aitutor.service.UserInfoService;
import com.agilesoda.aitutor.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/student/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    TutorStudentManagementService tutorStudentManagementService;

    // ST-USER-01 : 마이페이지 정보 조회 API
    @GetMapping("/mypage")
    public ResponseEntity<ApiResponse> getMyPage(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            UserInfo userInfo = UserInfo.builder()
                    .orgId(org_id)
                    .userId(user_id)
                    .userGrd(user_grd)
                    .userTestGrd(user_test_grd)
                    .build();

            UserMyPageResponseDto response = userService.getMyPageInfo(userInfo);


            if (response != null) {
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
            } else {
                throw new Exception("유저 정보 없음");
            }
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // ST-USER-02 : 사용자 비밀번호 변경 API
    @PostMapping("/change-pass")
    public ResponseEntity<ApiResponse> changePass(@RequestBody ChangPasswordRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            UserInfo userInfo = new UserInfo(null, request.getOrg_id(), request.getUser_id(), null, request.getUser_nm(), request.getUser_grd(), request.getUser_test_grd(), null, null, null, null, "1", null, null);
            int code = userService.changePassword(userInfo, request.getUser_pw_now(), request.getUser_pw_new());

            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // ST-USER-03 : 계정 등록 (usertype : 30(학생 / 20(교사) / 10(학교관리자) / 00(관리자))
    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse> insertStudent(@RequestBody UserSignRequestDto request, @AuthenticationPrincipal UserInfo userInfo) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        List<String> errorList = new ArrayList<>();
        try {

            if(request.getUser_id().equals(userInfo.getUserId())){
            errorList = userService.createUserInfo(request);
            } else{
                throw new Exception("로그인 계정과 정보 불일치");
            }

            if(errorList.isEmpty()){
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
            } else {
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SIGNUP_ERROR, new SignUpErrorListDto(errorList)), resHeaders, HttpStatus.OK));
            }
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.BAD_REQUEST));
        }
        //log.debug("계정 등록 API 진입 => {} / {} / {} / {} / {} / {} / {} / {} / {} / {} / {} / {} / {}", id, org_id, user_id, user_type, user_nm, user_grd, user_test_grd, class_id, user_email, user_pw, user_phone, user_state, auth);

    }

    // ST-USER-04 : 비밀번호 리셋 API
    @PostMapping("/reset-pass")
    public ResponseEntity<ApiResponse> resetPass(@RequestBody ResetPasswordRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            int code = userService.resetPassword(request);

            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // TU-02 : 사용자 이름 중복확인 API
    @PostMapping("/check-name")
    public ResponseEntity<ApiResponse> checkName(@RequestBody CheckRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            int code = userService.validateName(request.getOrg_id(), request.getUser_name());

            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

}
