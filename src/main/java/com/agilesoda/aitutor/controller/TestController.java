package com.agilesoda.aitutor.controller;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.DateTimeHelper;
import com.agilesoda.aitutor.config.util.PasswordHelper;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.model.RequestQstDto;
import com.agilesoda.aitutor.dto.student.QstResultDto;
import com.agilesoda.aitutor.dto.student.StudentResultDto;
import com.agilesoda.aitutor.repository.jpa.UserInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstInfoRepository;
import com.agilesoda.aitutor.service.TestService;
import com.agilesoda.aitutor.service.TutorClassManagementService;
import com.agilesoda.aitutor.service.UserInfoService;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
public class TestController {

    @Autowired
    TestService testService;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    TutorClassManagementService tutorClassManagementService;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @GetMapping("/test")
    public ResponseEntity<ApiResponse> selectTest(@RequestParam String userId) {

        // header 설정
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        // 작업
        List<UserPathInfo> userPathInfo = new ArrayList<>();
        userPathInfo = testService.select2(userId);

//        log.debug("userPathInfo.getUserPath => {}", userPathInfo.get(0).getUserPath());

        // return
        return (new ResponseEntity<>(new ApiResponse(200, userPathInfo), resHeaders, HttpStatus.OK));
    }

    @GetMapping("/get-time")
    public String getTime() {
        return DateTimeHelper.getDateTimeNow();
    }

    @GetMapping("/test/get-result")
    public ResponseEntity<ApiResponse> getResultTest(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level) {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        UserQstInfo userQstInfo = new UserQstInfo(org_id, user_id, user_grd, user_test_grd, user_test_level, null, null, null, null, null, null, null, null);

        List<QstResultDto> result = userQstInfoRepository.selectAnswerList(userQstInfo);

        List<String> qList = new ArrayList<>();
        List<Integer> rList = new ArrayList<>();

        for(QstResultDto q : result){
            qList.add(q.getQstId());
            if(q.getSubmitAnswer() != null && q.getSubmitAnswer().trim().equals(q.getQstAnswer().trim())){
                rList.add(1);
            } else{
                rList.add(0);
            }
        }

        log.debug(String.valueOf(qList));
        log.debug(String.valueOf(rList));
        RequestQstDto requestQstDto = new RequestQstDto(org_id, user_id, user_test_grd, user_test_level, qList, rList);

        return (new ResponseEntity<>(new ApiResponse(200, requestQstDto), resHeaders, HttpStatus.OK));
    }

    @GetMapping("/test/validate-password")
    public ResponseEntity<ApiResponse> validatePassword(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_pw) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("클래스 삭제 - 비밀번호 확인 API 진입 => {} / {}", org_id, user_id, user_pw);

        UserInfo userInfo = new UserInfo(null, org_id, user_id, null, null, user_grd, user_test_grd, null, null, null, null, null, null, null);

        int code = tutorClassManagementService.validatePassword(userInfo, user_pw);

        return (new ResponseEntity<>(new ApiResponse(code, null), resHeaders, HttpStatus.OK));
    }

    @GetMapping("/test/parse")
    public ResponseEntity<ApiResponse> parseTest(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd, String user_test_level){

        UserPathInfo userPathInfo = new UserPathInfo(org_id, user_id, user_grd, user_test_grd, user_test_level, null, null, null);

        String getUserPath = userPathInfoRepository.selectTest(userPathInfo);

        //2. Parser
        JSONParser jsonParser = new JSONParser();

        //3. To Object
        Object obj = null;
        try {
            obj = jsonParser.parse(getUserPath);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        //4. To JsonObject
        JSONObject jsonObj = (JSONObject) obj;
//        JSONObject resultObj = (JSONObject) jsonObj.get("result");
        JSONObject objResult = (JSONObject) jsonObj.get("path");
        Object pathId = objResult.get("path_id");
        Object pathNm = objResult.get("path_nm");
        Object graphInfo = objResult.get("graph_info");


        // 1. custom
        JSONObject test = new JSONObject();
        test.put("path_id", pathId);
        test.put("path_nm", pathNm);

        StudentResultDto response1 = new StudentResultDto("1", test,null);

        // 부분 출력
        StudentResultDto response2 = new StudentResultDto("1", pathNm, null);

        // 전체 출력
        StudentResultDto response3 = new StudentResultDto("1", objResult, null);


        return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response3), null, HttpStatus.OK));
    }

    @PostMapping("/test/sign-up")
    public ResponseEntity<ApiResponse> parseTest(@RequestBody List<HashMap<String, String>> request) {

        // org_id, user_id, user_type, user_nm, user_pw, user_state, user_role

        for(HashMap<String, String> hashMap : request){
            UserInfo userInfo = new UserInfo(hashMap.get("org_id")+"/"+hashMap.get("user_id"), hashMap.get("org_id"), hashMap.get("user_id"), hashMap.get("user_type"), null, null, null, null, null, PasswordHelper.encodePassword(hashMap.get("user_pw")), null, "1", hashMap.get("user_role"), DateTimeHelper.getDateTimeNow());
            userInfoRepository.save(userInfo);
        }

        return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, null), null, HttpStatus.OK));

    }
}
