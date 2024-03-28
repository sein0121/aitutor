package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.PasswordHelper;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.dto.user.StudentNameResponseDto;
import com.agilesoda.aitutor.repository.mapper.TutorStudentManageRepository;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.service.StudentResultService;
import com.agilesoda.aitutor.service.TutorStudentManagementService;
import com.agilesoda.aitutor.service.UserInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 교사(학생 관리) Controller
 *
 * @author Senna
 * @version 1.0.0
 * @date 2023.01.02
 **/
@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/tutor/student")
public class TutorStudentManagementController {

    @Autowired
    TutorStudentManagementService tutorStudentManagementService;

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    TutorStudentManageRepository tutorStudentManageRepository;

    @Autowired
    StudentResultService studentResultService;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    // TU-ST-01 : 학생 정보 조회 API
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> selectStudentList(@RequestParam String org_id, String user_id) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            List<String> allStudentList = tutorStudentManagementService.getAllStudentList(org_id, user_id);
            TutorStudentManageDto tutorStudentManageDto = tutorStudentManagementService.getStudentList(org_id, allStudentList);

            if (allStudentList.isEmpty()) {
                throw new Exception();
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, tutorStudentManageDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-ST-03 : 클래스 정보 조회 API
    @GetMapping("/class-info")
    public ResponseEntity<ApiResponse> selectClassInfo(@RequestParam String org_id, String user_id) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 정보 조회 API 진입 => {} / {}", org_id, user_id);

        try {
            // 클래스 정보 조회
            ClassInfoDto classInfoDto = tutorStudentManagementService.selectClassList(org_id, user_id);
            if (classInfoDto.getClass_list().isEmpty()) {
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classInfoDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }


    // TU-ST-04 : 아이디 자동생성을 위한 중복 확인 API
    @GetMapping("/auto-make")
    public ResponseEntity<ApiResponse> automakeId(@RequestParam String org_id, String user_id, String class_id) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 등록- 아이디 자동생성 => {} / {} / {}", org_id, user_id, class_id);
        try {
            IdInfoDto idList = tutorStudentManagementService.selectIdList(org_id, user_id, class_id);
            if (idList.getId_list().isEmpty()) {
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_DISABLE, idList), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ENABLE, null), resHeaders, HttpStatus.OK));
        }
    }


    // TU-ST-05 : 학생 이름 중복 확인 API
    @PostMapping("/overlap-studentname")
    public ResponseEntity<ApiResponse> overlapStudentname(@RequestBody OverlapStudentRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        List<OverlapStudentDto> overlapStudentDtos = new ArrayList<>();
        try {
            log.debug("학생 등록 : 중복확인 => {} / {} / {} / {}", request.getOrg_id(), request.getClass_id());

            overlapStudentDtos = tutorStudentManagementService.getOverlapStudentList(request);
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
        return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, new StudentNameResponseDto(overlapStudentDtos)), resHeaders, HttpStatus.OK));
    }


    // TU-ST-06 : 학생 삭제 API
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse> deleteStudent(@RequestBody DeleteStudentRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 삭제 API => {} ", request);
        try {
            tutorStudentManagementService.deleteStudent(request);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-ST-02 : 학생 검색 API
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchStudent(@RequestParam String org_id, String user_id, String search_type, String search_nm) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 검색 API 진입 => {} / {} / {} / {}", org_id, user_id, search_type, search_nm);

        try {
        // 클래스 리스트 가져오기
        List<String> allStudentList = tutorStudentManagementService.getAllStudentListBySearch(org_id, user_id, search_type, search_nm);
        TutorStudentSearchDto tutorStudentSearchDto = tutorStudentManagementService.getStudentSearchList(org_id, allStudentList);

            if(!allStudentList.isEmpty()){
                tutorStudentSearchDto = tutorStudentManagementService.getStudentSearchList(org_id, allStudentList);
            }

        return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, tutorStudentSearchDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // TU-ST-07 : 학생상세 진입 API
    @GetMapping("/detail")
    public ResponseEntity<ApiResponse> selectStudentResult(@RequestParam String org_id, String user_id, String user_grd) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("선생님용 학생 상세 API 진입 => {} / {} / {} ", org_id, user_id, user_grd);

        try {
            String userState = tutorStudentManagementService.getTutorUserState(org_id, user_id, user_grd);

            String userClassGbn = tutorStudentManagementService.getTutorUserClassGbn(org_id, user_id, user_grd);

            // userTestLevel 가져오기 - user_qst_info (예시 : [01, 02, 03])
            List<String> userTestLevelList = tutorStudentManagementService.getTutorUserTestLevelList(org_id, user_id, user_grd);

            // depth2 가져오기
            List<UserTestListDto> userTestListDto = tutorStudentManagementService.getTutorStudentResultDto(org_id, user_id, user_grd, userTestLevelList);

            // 경로 여부 확인
            List<String> userTestLevelLists = userPathInfoRepository.selectTutorUserLevels(org_id, user_id, user_grd);
            log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

            // 최종 경로 여부(99) 확인
            String finalPathYn = null;
            if (userTestLevelLists.contains("99")) {
                finalPathYn = "Y";
            } else {
                finalPathYn = "N";
            }

            Object pathInfo = tutorStudentManagementService.selectTuStPathInfo(org_id, user_id, user_grd);

            StudentDetailDto response = StudentDetailDto.builder()
                    .user_id(user_id)
                    .class_gbn(userClassGbn)
                    .user_state(userState)
                    .final_path_yn(finalPathYn)
                    .path_nm(pathInfo)
                    .user_test_list(userTestListDto)
                    .build();

            if(userTestListDto.isEmpty()){
                throw new Exception();
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    //학생 상세 - 그래프보기: 학생결과 그래프 보기 와 동일 (/final-path)

    // TU-ST-08 : 학생 상세 저장 API
    @PostMapping("/detail-save")
    public ResponseEntity<ApiResponse> detailSave(@RequestBody UserInfoRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 상세-저장 => {}", request.toString());
        String newPassword;
        try {
            if (request.getUser_test_grd().contains("undefined")){
                return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
            }
            else if (request.getNew_pw() != null) {
                newPassword = PasswordHelper.encodePassword(request.getNew_pw());
            } else {
                newPassword = null;
            }
            userInfoMapperRepository.studentDetailSave(request.getOrg_id(), request.getUser_id(), request.getUser_state(), newPassword, request.getUser_grd(), request.getUser_test_grd());
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

}
