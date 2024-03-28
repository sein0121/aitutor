package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserQstHistory;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.service.HistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/history")
public class HistoryController {

    @Autowired
    HistoryService historyService;

    // HIST-01 : 테스트 문항 진입 로그 생성 API
    @GetMapping("/qst-in")
    public ResponseEntity<ApiResponse> qstIn(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level, String qst_id){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        UserQstHistory userQstHistory = new UserQstHistory(org_id, user_id, user_grd, user_test_grd, user_test_level, qst_id, Timestamp.valueOf(LocalDateTime.now()), null, null);

        if(historyService.createQstHistory(userQstHistory) > 0) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } else{
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // HIST-02 : 테스트 문항 진입 로그 업데이트 API (out_date update)
    @GetMapping("/qst-out")
    public ResponseEntity<ApiResponse> qstOut(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level, String qst_id){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        UserQstHistory userQstHistory = new UserQstHistory(org_id, user_id, user_grd, user_test_grd, user_test_level, qst_id, null, Timestamp.valueOf(LocalDateTime.now()), null);

        if(historyService.updateQstHistory(userQstHistory) > 0) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } else{
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }

    }
}
