package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.dto.StudentResultRequestDto;
import com.agilesoda.aitutor.dto.student.QstListDto;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstInfoRepository;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class StudentResultService {

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    public List<String> getUserTestLevelList(String org_id, String user_id, String user_grd, String user_test_grd){
        return userQstInfoRepository.selectUserTestLevel(org_id, user_id, user_grd, user_test_grd);
    }

    public Object selectPathInfo(String org_id, String user_id, String user_grd, String user_test_grd){
        String pathInfo = userPathInfoRepository.selectPathInfo(org_id, user_id, user_grd, user_test_grd);

        if (pathInfo == null || pathInfo.equals("")) {
            return "";
        }

        // 20230207 수정
        Gson gson = new Gson();
        Object obj = null;

        try {
            obj = gson.fromJson(pathInfo, Object.class);
        }catch (Exception e){
            e.printStackTrace();
        }

//        JSONParser jsonParser = new JSONParser();
//
//        Object obj = null;
//        try {
//            obj = jsonParser.parse(pathInfo);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }

        return obj;
    }

    public Object selectGraphPath(String org_id, String user_id, String user_grd, String user_test_grd){
        String graphPath = userPathInfoRepository.selectGraphPath(org_id, user_id, user_grd, user_test_grd);

        JSONParser jsonParser = new JSONParser();

        Object obj = null;
        try {
            obj = jsonParser.parse(graphPath);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return obj;
    }


    public List<UserTestListDto> getStudentResultDto(String org_id, String user_id, String user_grd, String user_test_grd, List<String> userTestLevelList) {

        List<UserTestListDto> userTestListDto = new ArrayList<>();

        for (String userTestLevel : userTestLevelList) {
            StudentResultRequestDto request = new StudentResultRequestDto(org_id, user_id, user_grd, user_test_grd, userTestLevel);
            List<QstListDto> qstList = new ArrayList<>();

            // 임시저장여부 파악 (0:임시, 1:제출)
            List<String> tempGbn = userQstInfoRepository.selectGbnInfo(request);

            String testYN = null;
            testYN = getTestYN(tempGbn, testYN);

            if (testYN.equals("Y")) {
                // 테스트 완료 상태인 경우에만 depth3 가져오기
                qstList = userQstInfoRepository.selectQstInfo(request);
            }

            // 소요시간 파악
            String leadTime = userPathInfoRepository.selectLeadTime(request);

            userTestListDto.add(new UserTestListDto(userTestLevel, testYN, leadTime, qstList));

        }
        return userTestListDto;
    }

    private String getTestYN(List<String> tempGbn, String testYN) {
        for (String test : tempGbn) {
            if (test != null && test.contains("1")) {
                testYN = "Y";
            } else {
                testYN = "N";
                break;
            }
        }
        return testYN;
    }

    public String getUserState(String org_id, String user_id, String user_grd, String user_test_grd) {

        return userInfoMapperRepository.selectUserState(org_id, user_id, user_grd, user_test_grd);
    }
}
