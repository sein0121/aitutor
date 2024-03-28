package com.agilesoda.aitutor.controller.admin;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.admin.*;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.dto.user.CheckRequestDto;
import com.agilesoda.aitutor.dto.user.ValidateRequestDto;
import com.agilesoda.aitutor.repository.mapper.ClassInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.service.AdminClassManagementService;
import com.agilesoda.aitutor.service.AdminStudentManagementService;
import com.agilesoda.aitutor.service.TutorClassManagementService;
import com.agilesoda.aitutor.service.*;
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
@RequestMapping("/aitutor/api/v1/admin")
public class AdminController {

    @Autowired
    TutorClassManagementService tutorClassManagementService;

    @Autowired
    AdminClassManagementService adminClassManagementService;

    @Autowired
    AdminStudentManagementService adminStudentManagementService;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    ClassInfoRepository classInfoRepository;

    @Autowired
    AdminPageService adminPageService;

    // AD-01 : 관리자(기관) 계정관리 화면 데이터 조회 API
    @GetMapping("/admin-page")
    public ResponseEntity<ApiResponse> setAdminPageInfo(@RequestParam String org_id, String user_id, @AuthenticationPrincipal UserInfo userInfo){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("관리자(애자일소다) 계정관리 페이지 진입 => {}", user_id);
        AdminPageInfoDto response = new AdminPageInfoDto();
        try {

            if (user_id.equals(userInfo.getUserId()) && userInfo.getAuth().equals(AppConstant.ROLE_ADMIN)) {
                response.setTeacher_list(adminPageService.getTutorInfo(org_id, AppConstant.USER_TYPE_TUTOR));
            } else {
                throw new Exception("접속정보 불일치 또는 데이터 에러");
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-01 : 관리자 클래스 목록 조회 API
    @GetMapping("/class-list")
    public ResponseEntity<ApiResponse> selectClassList(@RequestParam String org_id, String user_id) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 목록 조회 API 진입 => {} / {}", org_id, user_id);

        try {
            // 클래스 리스트 가져오기
            AdminClassListResultDto classListResultDto = new AdminClassListResultDto(new ArrayList<>());
            List<String> allClassList = adminClassManagementService.getAllClassList(org_id, user_id);

            if (!allClassList.isEmpty()) {
                classListResultDto = adminClassManagementService.getClassList(org_id, allClassList);
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classListResultDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-02 : 관리자 클래스 검색 API
    @GetMapping("/class-search")
    public ResponseEntity<ApiResponse> searchClass(@RequestParam String org_id, String user_id, String search_type, String search_nm) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 검색 API 진입 => {} / {} / {} / {}", org_id, user_id, search_type, search_nm);

        try {
            // 클래스 리스트 가져오기
            AdminSearchClassListResultDto classListResultDto = new AdminSearchClassListResultDto(new ArrayList<>());
            List<String> allClassList = adminClassManagementService.getAllClassListBySearchAdmin(org_id, search_type, search_nm);

            if (!allClassList.isEmpty()) {
                classListResultDto = adminClassManagementService.getSearchClassList(org_id, allClassList);
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classListResultDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-03 : 관리자 클래스 이름 중복 확인 API
    @PostMapping("/validate-classname")
    public ResponseEntity<ApiResponse> validateClassname(@RequestBody CheckRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 등록 - 이름 중복 확인 API 진입 => {} / {}", request.getOrg_id(), request.getClass_nm());

        try {
            int code = tutorClassManagementService.validateClassName(request.getOrg_id(), request.getClass_nm());
            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-04 : 관리자 클래스 등록 API
    @PostMapping("/class-insert")
    public ResponseEntity<ApiResponse> insertClass(@RequestBody InsertClassRequestDto insertClassRequestDto) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 등록 API 진입 => {}", insertClassRequestDto);

        try {
            tutorClassManagementService.insertClass(insertClassRequestDto);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-05 : 관리자 비밀번호 일치 여부 확인 API
    @PostMapping("/validate-password")
    public ResponseEntity<ApiResponse> validatePassword(@RequestBody ValidateRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 삭제 - 비밀번호 확인 API 진입 => {} / {}", request.getOrg_id(), request.getUser_id(), request.getUser_pw());

        try {
            UserInfo userInfo = new UserInfo(null, request.getOrg_id(), request.getUser_id(), null, null, request.getUser_grd(), request.getUser_test_grd(), null, null, null, null, null, null, null);

            int code = tutorClassManagementService.validatePassword(userInfo, request.getUser_pw());

            return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-CL-06 : 관리자 클래스 삭제 API
    @PostMapping("/class-delete")
    public ResponseEntity<ApiResponse> deleteClass(@RequestBody DeleteClassRequestDto request, @AuthenticationPrincipal UserInfo userInfo) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 삭제 API 진입 => {}", request);

        try {
            if(userInfo.getUserId().equals(request.getUser_id())) {
                int code = adminClassManagementService.deleteClass(request);
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

    // AD-CL-07 : 관리자 클래스 상세 조회 API
    @GetMapping("/class-detail")
    public ResponseEntity<ApiResponse> detailInfo(@RequestParam String org_id, String class_id) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 - 클래스 상세 API 진입 => {} / {}", org_id);

        try {
            ClassDetailInfoDto classDetailInfoDto = adminClassManagementService.getClassDetailInfo(org_id, class_id);

            if (classDetailInfoDto == null) {
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classDetailInfoDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-01 : 관리자(기관) 학생 목록 페이지 진입 API
    @GetMapping("/student-list")
    public ResponseEntity<ApiResponse> selectStudentList(
            @RequestParam String org_id, String user_id){
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        log.debug("관리자 학생 목록 조회 API 진입 => {} / {}", org_id, user_id);
        try {
//            List<String> allStudentList = adminStudentManagementService.getAllStudentList(org_id, user_id);
            TutorStudentManageDto tutorStudentManageDto = adminStudentManagementService.getStudentList(org_id, user_id);
            if(tutorStudentManageDto.getStudent_list()==null){
                tutorStudentManageDto = adminStudentManagementService.getStudentList(org_id, user_id);
            }
            //log.debug("userInfo => {}", userInfo.get(0).getUserId());
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, tutorStudentManageDto), resHeaders, HttpStatus.OK));
        }catch (Exception e){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-02 : 관리자 학생관리 클래스 정보 조회 API
    @GetMapping("/student-class-info")
    public ResponseEntity<ApiResponse> selectClassInfo(@RequestParam String org_id, String user_id) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 학생관리 클래스 정보 조회 API 진입 => {} / {}", org_id, user_id);

        try {
            // 클래스 정보 조회
            ClassInfoDto classInfoDto = adminStudentManagementService.selectClassList(org_id, user_id);
            if(classInfoDto.getClass_list().isEmpty()){
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classInfoDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-03 : 관리자 학생관리 아이디 자동 생성 API
    @GetMapping("/student-auto-make")
    public ResponseEntity<ApiResponse> automakeId(@RequestParam String org_id, String user_id, String class_id){
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 학생 등록- 아이디 자동생성 => {} / {} / {}", org_id,user_id,class_id);
        try{
            IdInfoDto idList = adminStudentManagementService.selectIdList(org_id,user_id,class_id);
            if(idList.getId_list().isEmpty()){
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_DISABLE, idList), resHeaders, HttpStatus.OK));
        }catch (Exception e){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ENABLE, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-04 : 관리자 학생관리 이름 중복 API
    @PostMapping("/student-overlap-studentname")
    public ResponseEntity<ApiResponse> overlapStudentname(@RequestBody OverlapStudentRequestDto request){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 학생 등록 : 중복확인 => {} / {} ", request.getOrg_id(), request.getClass_id());

        List<OverlapStudentDto> response = adminStudentManagementService.getOverlapStudentList(request);

        return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS,response),resHeaders, HttpStatus.OK));
    }

    // AD-ST-05 : 관리자 학생관리 삭제 API
    @PostMapping("/student-delete")
    public ResponseEntity<ApiResponse> deleteStudent(@RequestBody DeleteStudentRequestDto request){

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자 학생 삭제 API => {} ", request);

        try{
            adminStudentManagementService.deleteStudent(request);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        } catch (Exception e){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-06 : 관리자 학생관리 검색 API
    @GetMapping("/student-search")
    public ResponseEntity<ApiResponse> searchStudent(@RequestParam String org_id, String user_id, String search_type, String search_nm) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 검색 API 진입 => {} / {} / {} / {}", org_id, user_id, search_type, search_nm);

        try {
            // 클래스 리스트 가져오기
            List<String> allStudentList = adminStudentManagementService.getAllStudentListBySearch(org_id, user_id, search_type, search_nm);
            TutorStudentSearchDto tutorStudentSearchDto = adminStudentManagementService.getStudentSearchList(org_id, allStudentList);

            if(allStudentList.isEmpty()){
                tutorStudentSearchDto= adminStudentManagementService.getStudentSearchList(org_id, allStudentList);
            }

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, tutorStudentSearchDto), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // AD-ST-07 : 관리자 학생상세 진입 API
    @GetMapping("/student-detail")
    public ResponseEntity<ApiResponse> selectStudentResult(@RequestParam String org_id, String user_id, String user_grd) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자(기관) 학생 상세 API 진입 => {} / {} / {} ", org_id, user_id, user_grd);


        try {
            String userState = adminStudentManagementService.getUserState(org_id, user_id, user_grd);

            String userClassGbn = adminStudentManagementService.getTutorUserClassGbn(org_id, user_id, user_grd);
            // userTestLevel 가져오기 - user_qst_info (예시 : [01, 02, 03])
            List<String> userTestLevelList = adminStudentManagementService.getUserTestLevelList(org_id, user_id, user_grd);

            // depth2 가져오기
            List<UserTestListDto> userTestListDto = adminStudentManagementService.getStudentResultDto(org_id, user_id, user_grd, userTestLevelList);
            if(userTestListDto.isEmpty()){
                throw new Exception();
            }
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
            Object pathInfo = adminStudentManagementService.selectTuStPathInfo(org_id, user_id, user_grd);

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

    //관리자 학생 상세 그래프보기 API : 학생결과 그래프 보기 와 동일 (/final-path)

    //관리자 클래스 변경 API
    @GetMapping("/class-change")
    public ResponseEntity<ApiResponse> selectClassChange(@RequestParam String org_id){
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자(기관) 학생 상세 클래스 변경 API 진입 => {}", org_id);

        try{
            AdminClassChangeDto classList = adminStudentManagementService.selectClassChangeList(org_id);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, classList), resHeaders, HttpStatus.OK));
        }catch (Exception e){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    //관리자 클래스 변경 - 동일 선생님 API
    @PostMapping("/class-change-same")
    public ResponseEntity<ApiResponse> classChangeSameTutor(@RequestBody ChangeClassSameTutorDto request){
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("관리자(기관) 학생 상세 클래스 변경 API 진입 => {} ", request);

        try{
            adminStudentManagementService.updateClassSameTutor(request);
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), resHeaders, HttpStatus.OK));
        }catch(Exception e ){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    //관리자 클래스 변경 - 다른 선생님 API


    // AD-04 : 관리자 마이페이지 - 사용자 비밀번호 변경(list)
    @PostMapping("/change-pass-list")
    public ResponseEntity<ApiResponse> changePass(@RequestBody ChangePassListRequestDto request) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        List<String> errorList = new ArrayList<>();

        try {
            errorList = adminPageService.updateTutorPw(request.getOrg_id(), request.getTeacher_list());
            if(errorList == null){
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, errorList), resHeaders, HttpStatus.OK));

        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, e.getMessage()), resHeaders, HttpStatus.OK));
        }
    }
}
