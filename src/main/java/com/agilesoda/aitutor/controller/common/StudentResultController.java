package com.agilesoda.aitutor.controller.common;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.dto.*;
import com.agilesoda.aitutor.dto.student.FinalGraphDto;
import com.agilesoda.aitutor.dto.student.StudentResultDto;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.repository.mapper.UnitInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.service.StudentResultService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * 학생 결과 확인 Controller
 *
 * @author Howard, Senna
 * @version 1.0.0
 * @date 2023.01.02
 *
 **/
@Slf4j
@RestController
@RequestMapping("/aitutor/api/v1/student/result")
public class StudentResultController {

    @Autowired
    StudentResultService studentResultService;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UnitInfoRepository unitInfoRepository;

    // ST-RE-01 : 학생 테스트 결과 조회 API
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> selectStudentResult(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd) {

        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 테스트 결과 조회 API 진입 => {} / {} / {} / {}", org_id, user_id, user_grd, user_test_grd);

        try {
            // userTestLevel 가져오기 - user_qst_info (예시 : [01, 02, 03])
            List<String> userTestLevelList = studentResultService.getUserTestLevelList(org_id, user_id, user_grd, user_test_grd);

            if (userTestLevelList.isEmpty()) {
                throw new Exception();
            }
            // depth2 가져오기
            List<UserTestListDto> userTestListDto = studentResultService.getStudentResultDto(org_id, user_id, user_grd, user_test_grd, userTestLevelList);

            // 경로 여부 확인
            List<String> userTestLevelLists = userPathInfoRepository.selectUserTestLevels(org_id, user_id, user_grd, user_test_grd);
            log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

            // 최종 경로 여부(99) 확인
            String finalPathYn = null;
            if (userTestLevelLists.contains("99")) {
                finalPathYn = "Y";
            } else {
                finalPathYn = "N";
            }

            Object pathInfo = studentResultService.selectPathInfo(org_id, user_id, user_grd, user_test_grd);

            StudentResultDto response = StudentResultDto.builder()
                    .final_path_yn(finalPathYn)
                    .path_nm(pathInfo)
                    .user_test_list(userTestListDto)
                    .build();

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }

    // ST-RE-02 : 학생 테스트 결과 전체 경로 그래프 가져오기 API
    @GetMapping("/final-path")
    public ResponseEntity<ApiResponse> selectFinalPath(@RequestParam String org_id, String user_id, String user_grd, String user_test_grd){
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        log.debug("학생 결과 - 전체경로 API => {} / {} / {} / {}", org_id, user_id,user_grd,user_test_grd);

        try{
            Object graphPath = studentResultService.selectGraphPath(org_id, user_id,user_grd,user_test_grd);
            FinalGraphDto response = FinalGraphDto.builder().graph_path(graphPath).build();
            if(response.getFinal_path()==null){
                throw new Exception();
            }
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        }catch (Exception e){
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.OK));
        }
    }



}
