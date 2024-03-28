package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.dto.student.AccessTestPageDto;
import com.agilesoda.aitutor.dto.student.QstResultRequestDto;
import com.agilesoda.aitutor.service.StudentTestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 학생 테스트 Controller
 *
 * @author Phillip
 * @version 1.0.0
 * @date 2023.01.02
 **/
@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/student/test")
public class StudentTestController {

    @Autowired
    StudentTestService studentTestService;

    // ST-TEST-01 : 테스트 문항 리스트 조회 API
    @GetMapping("/qst-list")
    public ResponseEntity<ApiResponse> getQstList(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("테스트 문항 리스트 조회 API 진입 => {} / {} / {}", org_id, user_id, user_test_level);

        try {
            RequestDto request = new RequestDto(org_id, user_id, user_grd, user_test_grd, user_test_level, null, null, null);

            AccessTestPageDto response = studentTestService.getTestQstList(request);

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }

    }

    // ST-TEST-02 : 테스트 중지 API
    @PostMapping("/qst-pause")
    public ResponseEntity<ApiResponse> pauseQst(@RequestBody QstResultRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("테스트 중지 API 진입 => {} / {} / {}", request.getOrg_id(), request.getUser_id(), request.getUser_test_level());

        if(request.getTotal_time() == null){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        }
        try {
            UserPathInfo userPathInfo = new UserPathInfo(request.getOrg_id(), request.getUser_id(), request.getUser_grd(), request.getUser_test_grd(), request.getUser_test_level(), null, null, request.getTotal_time());

            if (studentTestService.updateTotalTime(userPathInfo) > 0) {
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
            } else {
                throw new Exception("테스트 중지 중 에러 발생");
            }

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }

    }

    // ST-TEST-03 : 테스트 문항 답변 저장 API
    @PostMapping("/qst-save")
    public ResponseEntity<ApiResponse> saveQst(@RequestBody RequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("테스트 문항 답변 저장 API 진입 => {} / {} / {}", request.getOrg_id(), request.getUser_id(), request.getUser_test_level());

        try {
            UserQstInfo userQstInfo = new UserQstInfo(request.getOrg_id(), request.getUser_id(), request.getUser_grd(), request.getUser_test_grd(), request.getUser_test_level(), null, request.getQst_id(), null, null, null, null, request.getQst_answer(), "0");

            studentTestService.setSubmit(userQstInfo, request.getTotal_time());

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // ST-TEST-04 : 테스트 완료 후 답안지 제출 API
    @PostMapping("/qst-submission")
    public ResponseEntity<ApiResponse> setQstResult(@RequestBody QstResultRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("테스트 완료 후 답안지 제출 API 진입 => {} / {} / {}", request.getOrg_id(), request.getUser_grd(), request.getUser_test_level());

        try {

            UserQstInfo userQstInfo = new UserQstInfo(request.getOrg_id(), request.getUser_id(), request.getUser_grd(), request.getUser_test_grd(), request.getUser_test_level(), null, null, null, null, null, null, null, "1");

            // TODO: 모든 문항 제출 완료 상태인지 확인 (20230116)
            if(0 < studentTestService.getTempGbnNullCount(userQstInfo)){
                throw new Exception("모든 문제를 풀지 않았습니다.");
            }

            if(AppConstant.RESPONSE_ERROR == studentTestService.setFinalSubmit(userQstInfo, request.getTotal_time())){
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }
}
