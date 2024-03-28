package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.DateTimeHelper;
import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.dto.model.ModelResultDto;
import com.agilesoda.aitutor.dto.model.ResponseModelDto;
import com.agilesoda.aitutor.dto.student.AccessTestPageDto;
import com.agilesoda.aitutor.dto.student.HistoryAnswerRequestDto;
import com.agilesoda.aitutor.dto.student.QstInfoDto;
import com.agilesoda.aitutor.dto.student.QstResultDto;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstInfoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class StudentTestService {

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    HistoryService historyService;

    @Autowired
    ModelCallService modelCallService;

    public AccessTestPageDto getTestQstList(RequestDto request) {

        // 필요한 데이터
        //  rsp_code		응답코드
        //  start_qst		문제시작번호
        //  total_time		경과 시간 ( user_path_info : total_time)
        //  qst_list
        //	    qst_id	문제ID                    (user_qst_info : qst_id)
        //	    edu_level_nm	교육 과정 단계명    (unit_info : edu_level_nm)
        //	    unit_nm	단원명                     (unit_info : unit_nm)
        //	    qst_img_file_nm	문제 이미지 파일명   (qst_info : qst_img_file_nm)
        //	    submit_answer	제출 정답          (user_qst_info : submit_answer)
        //	    qst_seq	문제출제번호                (user_qst_info : qst_seq)
        // user_qst_info : qst_id -> qst_info : qst_class_id -> unit_info

        int total_time = userPathInfoRepository.selectTotalTime(request);
        int start_qst = 1;

        List<QstInfoDto> qstInfoDtos = userQstInfoRepository.selectTestQstList(request);


        for (QstInfoDto q : qstInfoDtos) {
            if (q.getSubmit_answer() == null || q.getSubmit_answer().equals("")) {
                start_qst = q.getQst_seq();
                break;
            }
        }

        String qstCreateDate = userQstInfoRepository.checkTestDate(request);
        if (qstCreateDate == null) {
            userQstInfoRepository.updateTestDate(request.getOrg_id(), request.getUser_id(), request.getUser_grd(), request.getUser_test_grd(), request.getUser_test_level(), DateTimeHelper.getDateTimeNow());
        }

        return new AccessTestPageDto(qstInfoDtos, start_qst, total_time);
    }

    @Transactional
    public int updateTotalTime(UserPathInfo userPathInfo) {
        return userPathInfoRepository.updateTotalTime(userPathInfo);
    }

    @Transactional
    public void setSubmit(UserQstInfo userQstInfo, String total_time) {

        String dateTime = DateTimeHelper.getDateTimeNow();

        String originSubmit = userQstInfoRepository.selectSubmit(userQstInfo);
        if (originSubmit == null || originSubmit.equals("")) {
            userQstInfo.setSubmitDate(dateTime);
            userQstInfo.setChgDate(dateTime);
        } else {
            userQstInfo.setChgDate(dateTime);
        }
        // String orgId, String userId, String userGrd, String userTestGrd, String userTestLevel, String userQstPath, String userAnswerPath, String totalTime
        userPathInfoRepository.updateTotalTime(new UserPathInfo(userQstInfo.getOrgId(), userQstInfo.getUserId(), userQstInfo.getUserGrd(), userQstInfo.getUserTestGrd(), userQstInfo.getUserTestLevel(), null, null, total_time));
        userQstInfoRepository.updateSubmit(userQstInfo);

        // TODO: submit log 테이블 insert
        historyService.createAnswerHistory(new HistoryAnswerRequestDto(userQstInfo));
    }

    @Transactional
    public int setFinalSubmit(UserQstInfo userQstInfo, String totalTime) {

        ObjectMapper om = new ObjectMapper();

        // Map or List Object 를 JSON 문자열로 변환
        try {

            List<String> qList = new ArrayList<>();
            List<Integer> rList = new ArrayList<>();

            // qList, rList 구하기 (sort 기준 수정일자 빠른 순으로)
            setAnswerList(userQstInfo, qList, rList);


            String qStr = om.writeValueAsString(qList);
            String rStr = om.writeValueAsString(rList);


            // totalTime + qList, rList도 업데이트하게 수정
            UserPathInfo userPathInfo = new UserPathInfo();
            userPathInfo.updateTotalTime(userQstInfo, totalTime);
            userPathInfo.setResultPath(qStr, rStr);

            userPathInfoRepository.updateResultData(userPathInfo);

            userQstInfoRepository.updateTempGbn(userQstInfo);

            // 모델 호출
            ResponseModelDto responseModelDto = callModelQstList(userQstInfo);

            // response 데이터 user_path_info에 저장

            UserPathInfo userPathInfo1 = new UserPathInfo(userQstInfo.getOrgId(), userQstInfo.getUserId(), userQstInfo.getUserGrd(), userQstInfo.getUserTestGrd(), null, null, null, "0");
            if(!parseResult(userPathInfo1, responseModelDto.getResult()).equals("success")){
                throw new Exception();
            }

            if (responseModelDto.getRsp_code() == 0) {
                userPathInfo1.setUserTestLevel(getTestLevel(userPathInfo.getUserTestLevel()));
                insertQstPath(userPathInfo1);
                insertQstList(userQstInfo, responseModelDto.getResult().getNext_test_list());

            } else {
                userPathInfo1.setUserTestLevel("99");
                insertQstPath(userPathInfo1);
            }
        } catch (Exception exception) {
            return AppConstant.RESPONSE_ERROR;
        }

        return AppConstant.RESPONSE_SUCCESS;

    }

    public void insertFirstQstPath(UserPathInfo userPathInfo) {
        userPathInfoRepository.saveInfo(userPathInfo);
    }

    public void insertFirstQstList(UserQstInfo userQstInfo, List<String> next_test_list) {

        int count = 1;

        for (String qstId : next_test_list) {
            userQstInfo.setQstInfo(count, qstId);
            userQstInfoRepository.saveQst(userQstInfo);
            count++;
        }

    }


    public void insertQstPath(UserPathInfo userPathInfo) {
        userPathInfoRepository.saveInfo(userPathInfo);
    }

    public String getTestLevel(String userTestLevel) {
        String testLevel;
        if (userTestLevel.equals("01")) {
            testLevel = "02";
        } else {
            testLevel = "03";
        }

        return testLevel;
    }

    public void insertQstList(UserQstInfo userQstInfo, List<String> next_test_list) {

        String testLevel = getTestLevel(userQstInfo.getUserTestLevel());

        int count = 1;

        UserQstInfo qstInfo = new UserQstInfo(userQstInfo.getOrgId(), userQstInfo.getUserId(), userQstInfo.getUserGrd(), userQstInfo.getUserTestGrd(), testLevel, null, null, DateTimeHelper.getDateTimeNow(), null, null, null, "", null);

        for (String qstId : next_test_list) {
            qstInfo.setQstInfo(count, qstId);
            userQstInfoRepository.saveQst(qstInfo);
            count++;
        }

    }


    public void setAnswerList(UserQstInfo userQstInfo, List<String> qList, List<Integer> rList) {
        List<QstResultDto> answerList = userQstInfoRepository.selectAnswerList(userQstInfo);

        for (QstResultDto q : answerList) {
            qList.add(q.getQstId());
            if (q.getSubmitAnswer() != null && q.getSubmitAnswer().trim().equals(q.getQstAnswer().trim())) {
                rList.add(1);
            } else {
                rList.add(0);
            }
        }
    }

    public ResponseModelDto callModelQstList(UserQstInfo userQstInfo) {

        List<String> qList = new ArrayList<>();
        List<Integer> rList = new ArrayList<>();

        UserPathInfo userPathInfo = new UserPathInfo(userQstInfo);

        // qList, rList select 해오기
        for (String testLevel : AppConstant.TEST_LEVEL_LIST) {
            userPathInfo.setUserTestLevel(testLevel);
            List<QstResultDto> answerList = userQstInfoRepository.selectAnswerList2(userPathInfo);
            for (QstResultDto q : answerList) {
                qList.add(q.getQstId());
                if (q.getSubmitAnswer() != null && q.getSubmitAnswer().trim().equals(q.getQstAnswer().trim())) {
                    rList.add(1);
                } else {
                    rList.add(0);
                }
            }

        }

//        boolean yn = true;
//        RequestFirstDto path = new RequestFirstDto("test", "test", "test"); // 더미 데이터
//
//        if(yn){
//            List<String> test_qList1 = Arrays.asList("JH00654", "JH00666", "JH00697", "JH00707", "JH00743", "JH00751", "JH00784", "JH00795", "JH00828", "JH00838");
//            List<String> test_qList2 = Arrays.asList("JH00870", "JH00883", "JH00911", "JH00912", "JH00933", "JH00964", "JH00976");
//            ModelResultDto result = new ModelResultDto(test_qList1, path);
//            return new ResponseModelDto(0, result);
//        } else{
//            ModelResultDto result = new ModelResultDto(null, path);
//            return new ResponseModelDto(1, result);
//        }
        return modelCallService.callQstList(userQstInfo.getOrgId(), userQstInfo.getUserId(), userQstInfo.getUserTestGrd(), userQstInfo.getUserTestLevel(), qList, rList);
    }

    public int getTempGbnNullCount(UserQstInfo userQstInfo) {
        return userQstInfoRepository.selectTempGbnNullCount(userQstInfo);
    }

    public String parseResult(UserPathInfo userPathInfo, ModelResultDto modelResultDto){

        try {
            ObjectMapper om = new ObjectMapper();

            String next_test_list = om.writeValueAsString(modelResultDto.getNext_test_list()).equals("null")? null : om.writeValueAsString(modelResultDto.getNext_test_list());
            String path_nm = om.writeValueAsString(modelResultDto.getPath().getPath_nm()).equals("null")? null : om.writeValueAsString(modelResultDto.getPath().getPath_nm());
            String path_id = om.writeValueAsString(modelResultDto.getPath().getPath_id()).equals("null")? null : om.writeValueAsString(modelResultDto.getPath().getPath_id());
            String graph_path = om.writeValueAsString(modelResultDto.getPath().getGraph_info()).equals("null")? null : om.writeValueAsString(modelResultDto.getPath().getGraph_info());

            userPathInfo.setModelResult(next_test_list, path_nm, path_id, graph_path);

            return "success";
        } catch (Exception e) {
            return "fail";
        }
    }
}
