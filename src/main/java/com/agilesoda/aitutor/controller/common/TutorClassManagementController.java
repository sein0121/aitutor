package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.dto.user.CheckRequestDto;
import com.agilesoda.aitutor.dto.user.ValidateRequestDto;
import com.agilesoda.aitutor.repository.mapper.ClassInfoRepository;
import com.agilesoda.aitutor.service.TutorClassManagementService;
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

/**
 *
 * 교사(class관리) Controller
 *
 * @author Howard
 * @version 1.0.0
 * @date 2023.01.02
 *
 **/
@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/tutor/class")
public class TutorClassManagementController {

    @Autowired
    TutorClassManagementService tutorClassManagementService;

    @Autowired
    ClassInfoRepository classInfoRepository;

    @Autowired
    UserService userService;

    // TU-01 : 마이페이지(선생님) 정보 조회 API
    @GetMapping("/mypage")
    public ResponseEntity<ApiResponse> getMyPage(@RequestParam String org_id, String user_id, String user_type){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            UserInfo userInfo = UserInfo.builder()
                    .orgId(org_id)
                    .userId(user_id)
                    .userType(user_type)
                    .build();

            TutorMyPageResponseDto response = userService.getTutorName(userInfo);

            if (response != null) {
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
            } else {
                throw new Exception("유저 정보 없음");
            }
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-01 : 클래스 목록 조회 API
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> selectClassList(@RequestParam String org_id, String user_id) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 목록 조회 API 진입 => {} / {}", org_id, user_id);

        try {
            // 클래스 리스트 가져오기
            ClassListResultDto classListResultDto = new ClassListResultDto(new ArrayList<>());
            List<String> allClassList = tutorClassManagementService.getAllClassList(org_id, user_id);

            if (!allClassList.isEmpty()) {
                classListResultDto = tutorClassManagementService.getClassList(org_id, allClassList);
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classListResultDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-02 : 클래스 검색 API
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchClass(@RequestParam String org_id, String user_id, String search_type, String search_nm) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 검색 API 진입 => {} / {} / {} / {}", org_id, user_id, search_type, search_nm);

        try {
            // 클래스 리스트 가져오기
            SearchClassListResultDto classListResultDto = new SearchClassListResultDto(new ArrayList<>());
            List<String> allClassList = tutorClassManagementService.getAllClassListBySearch(org_id, user_id, search_type, search_nm);

            if (!allClassList.isEmpty()) {
                classListResultDto = tutorClassManagementService.getSearchClassList(org_id, allClassList);
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classListResultDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-03 : 클래스 이름 중복 확인 API
    @PostMapping("/validate-classname")
    public ResponseEntity<ApiResponse> validateClassname(@RequestBody CheckRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 등록 - 이름 중복 확인 API 진입 => {} / {}", request.getOrg_id(), request.getClass_nm());

        try {
            int code = tutorClassManagementService.validateClassName(request.getOrg_id(), request.getClass_nm());
            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-04 : 클래스 등록 API
    @PostMapping("/insert")
    public ResponseEntity<ApiResponse> insertClass(@RequestBody InsertClassRequestDto insertClassRequestDto) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 등록 API 진입 => {}", insertClassRequestDto);

        try {
            tutorClassManagementService.insertClass(insertClassRequestDto);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-05 : 비밀번호 일치 여부 확인 API
    @PostMapping("/validate-password")
    public ResponseEntity<ApiResponse> validatePassword(@RequestBody ValidateRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 삭제 - 비밀번호 확인 API 진입 => {} / {}", request.getOrg_id(), request.getUser_id(), request.getUser_pw());

        try {
            UserInfo userInfo = new UserInfo(null, request.getOrg_id(), request.getUser_id(), null, null, request.getUser_grd(), request.getUser_test_grd(), null, null, null, null, null, null, null);

            int code = tutorClassManagementService.validatePassword(userInfo, request.getUser_pw());

            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-06 : 클래스 삭제 API
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteClass(@RequestBody DeleteClassRequestDto request, @AuthenticationPrincipal UserInfo userInfo) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 삭제 API 진입 => {}", request);

        try {
            if(userInfo.getUserId().equals(request.getUser_id())) {
                int code = tutorClassManagementService.deleteClass(request);
                if (code == AppConstant.RESPONSE_ERROR) {
                    throw new Exception();
                }
                return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
            } else {
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, "계정정보 불일치"), resHeaders, HttpStatus.OK));
            }
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-CL-07 : 클래스 상세 조회 API
    @GetMapping("/detail")
    public ResponseEntity<ApiResponse> detailInfo(@RequestParam String org_id, String mgr_id, String class_id) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 상세 API 진입 => {} / {} / {}", org_id, mgr_id, class_id);

        try {
            ClassDetailInfoDto classDetailInfoDto = tutorClassManagementService.getClassDetailInfo(org_id, mgr_id, class_id);

            if (classDetailInfoDto == null) {
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classDetailInfoDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

}
