package com.agilesoda.aitutor.controller.admin;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.admin.GroupListResponseDto;
import com.agilesoda.aitutor.dto.admin.SuperAdminRequestDto;
import com.agilesoda.aitutor.service.SuperAdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/agilesoda")
public class SuperAdminController {

    @Autowired
    SuperAdminService superAdminService;

    // AD-02 : 관리자(애자일소다) 계정관리 페이지 데이터 조회 API
    @GetMapping("/group-list")
    public ResponseEntity<ApiResponse> selectClassList(
            @RequestParam String user_id,
            @AuthenticationPrincipal UserInfo userInfo) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("관리자(애자일소다) 계정관리 페이지 진입 => {}", user_id);
        GroupListResponseDto response = new GroupListResponseDto();
        try {

            if (user_id.equals(userInfo.getUserId()) && userInfo.getAuth().equals(AppConstant.ROLE_SUPER)) {
                response.setOrg_list(superAdminService.getOrgUserInfo());
            } else {
                throw new Exception("접속정보 불일치 또는 데이터 에러");
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // AD-03 : 관리자(애자일소다) 기관 명 업데이트 API
    @PostMapping("/org-update")
    public ResponseEntity<ApiResponse> saveOrg(@RequestBody SuperAdminRequestDto request, @AuthenticationPrincipal UserInfo userInfo) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("관리자(애자일소다) 계정관리 기관명 update API 진입 => {}", request.getUser_id());

        try {
            if (request.getUser_id().equals(userInfo.getUserId()) && userInfo.getAuth().equals(AppConstant.ROLE_SUPER)) {
                superAdminService.updateOrgName(request.getModify_list());
            } else {
                throw new Exception("접속정보 불일치 또는 데이터 에러");
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }
}
