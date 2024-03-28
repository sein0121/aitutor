package com.agilesoda.aitutor.service;


import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.DataHelper;
import com.agilesoda.aitutor.config.util.DateTimeHelper;
import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.model.ModelResultDto;
import com.agilesoda.aitutor.dto.model.ResponseModelDto;
import com.agilesoda.aitutor.dto.student.QstListDto;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.dto.user.UserInfoDto;
import com.agilesoda.aitutor.repository.mapper.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TutorStudentManagementService {

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    @Autowired
    StudentTestService studentTestService;

    @Autowired
    ModelCallService modelCallService;

    @Autowired
    StudentInfoRepository studentInfoRepository;

    @Autowired
    TutorStudentManageRepository tutorStudentManageRepository;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    public List<String> getAllStudentList(String org_id, String user_id) {
        return userInfoMapperRepository.selectAllStudentInfo(org_id, user_id);
    }

    public TutorStudentManageDto getStudentList(String org_id, List<String> allStudentList) {

        TutorStudentManageDto response = null;

        for (String userId : allStudentList) {
            log.debug("user 명 => {}", userId);

            StudentListRequestDto request = new StudentListRequestDto(org_id, userId);
            List<StudentListDto> studentListDto = userInfoMapperRepository.selectStudentInfo(request);

            response = TutorStudentManageDto.builder()
                    .student_list(studentListDto)
                    .build();
        }
        return response;
    }


    public List<String> getAllStudentListBySearch(String org_id, String user_id, String search_type, String search_nm) {

        switch (search_type) {
            case "all":
                return userInfoMapperRepository.selectAllStudentInfoBySearchAll(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
            case "grade":
                return userInfoMapperRepository.selectAllStudentInfoBySearchGrade(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
            case "class":
                return userInfoMapperRepository.selectAllStudentInfoBySearchClass(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
            default:
                return null;
        }
    }


    public TutorStudentSearchDto getStudentSearchList(String org_id, List<String> allStudentList) {
        TutorStudentSearchDto response = new TutorStudentSearchDto();
        List<StudentListDto> list = new ArrayList<>();

        for (String userId : allStudentList) {
            log.debug("user 명 => {}", userId);

            StudentListRequestDto request = new StudentListRequestDto(org_id, userId);
            StudentListDto studentListDto = userInfoMapperRepository.selectStudentSearchInfo(request);

            list.add(studentListDto);
        }

        response.setSearch_list(list);
        return response;
    }

    public List<OverlapStudentDto> getOverlapStudentList(OverlapStudentRequestDto request) {

        List<OverlapStudentDto> list = new ArrayList<>();

        for (String studentId : request.getStudent_list()) {
            if (0 < userInfoMapperRepository.selectOverlapStudentName(request.getOrg_id(), studentId)) {
                list.add(new OverlapStudentDto(studentId, "y"));
            } else {
                list.add(new OverlapStudentDto(studentId, "n"));
            }

        }

        return list;
    }

    public int setFirstQstInfo(UserInfoDto userInfoDto) {


        ObjectMapper om = new ObjectMapper();

        try {
// Type definition error: [simple type, class com.agilesoda.aitutor.dto.model.ResponseModelDto]
            // 더미 데이터로 테스트
            ResponseModelDto responseModelDto = modelCallService.callFirstQstList(userInfoDto.getOrgId(), userInfoDto.getUserId(), userInfoDto.getUserTestGrd());
//            RequestFirstDto path = null; // 더미 데이터
//            List<String> qList = Arrays.asList("JH00021", "JH00036", "JH00066", "JH00076", "JH00107", "JH00120", "JH00137", "JH00144", "JH00159", "JH00162", "JH00185", "JH00187", "JH00242", "JH00244", "JH00275", "JH00288", "JH00310", "JH00319", "JH00329", "JH00331", "JH00361", "JH00373", "JH00407", "JH00440", "JH00519", "JH00535", "JH00566", "JH00576", "JH00611", "JH00624");
//            ModelResultDto result = new ModelResultDto(qList, path);
//            ResponseModelDto responseModelDto = new ResponseModelDto(0, result);


            if (responseModelDto.getRsp_code() == 0) {
                UserPathInfo userPathInfo = new UserPathInfo(userInfoDto.getOrgId(), userInfoDto.getUserId(), userInfoDto.getUserGrd(), userInfoDto.getUserTestGrd(), "01", null, null, "0");
                if (!parseResult(userPathInfo, responseModelDto.getResult()).equals("success")) {
                    throw new Exception();
                }
                UserQstInfo userQstInfo = new UserQstInfo(userInfoDto.getOrgId(), userInfoDto.getUserId(), userInfoDto.getUserGrd(), userInfoDto.getUserTestGrd(), "01", null, null, DateTimeHelper.getDateTimeNow(), null, null, null, "", null);

                studentTestService.insertFirstQstPath(userPathInfo);
                studentTestService.insertFirstQstList(userQstInfo, responseModelDto.getResult().getNext_test_list());

            } else {
                throw new Exception();
            }

        } catch (Exception exception) {
            return AppConstant.RESPONSE_ERROR;
        }

        return AppConstant.RESPONSE_SUCCESS;

    }


    public ClassInfoDto selectClassList(String org_id, String user_id) {
        List<StudentClassInfoDto> classList = userInfoMapperRepository.selectClassList(org_id, user_id);

        ClassInfoDto response = ClassInfoDto.builder()
                .class_list(classList)
                .build();

        return response;
    }


    public IdInfoDto selectIdList(String org_id, String user_id, String class_id) {
        List<IdListDto> idList = userInfoMapperRepository.selectIdList(org_id, user_id, class_id);

        IdInfoDto response = IdInfoDto.builder().id_list(idList).build();

        return response;
    }

    public String parseResult(UserPathInfo userPathInfo, ModelResultDto modelResultDto) {

        try {
            ObjectMapper om = new ObjectMapper();

            String next_test_list = om.writeValueAsString(modelResultDto.getNext_test_list()).equals("null") ? null : om.writeValueAsString(modelResultDto.getNext_test_list());
            String path_nm = om.writeValueAsString(modelResultDto.getPath().getPath_nm()).equals("null") ? null : om.writeValueAsString(modelResultDto.getPath().getPath_nm());
            String path_id = om.writeValueAsString(modelResultDto.getPath().getPath_id()).equals("null") ? null : om.writeValueAsString(modelResultDto.getPath().getPath_id());
            String graph_path = om.writeValueAsString(modelResultDto.getPath().getGraph_info()).equals("null") ? null : om.writeValueAsString(modelResultDto.getPath().getGraph_info());

            userPathInfo.setModelResult(next_test_list, path_nm, path_id, graph_path);

            return "success";
        } catch (Exception e) {
            return "fail";
        }
    }

    public void deleteStudent(DeleteStudentRequestDto request) {

        List<String> studentList = new ArrayList<>();

        for (int i = 0; i < request.getStudent_id().size(); i++) {
            studentList.add(request.getStudent_id().get(i));
            log.debug("studentList 값 => {}", studentList);
        }

        for (String c : studentList) {
            userInfoMapperRepository.deleteStudent(request.getOrg_id(), c, request.getUser_id());
            userQstInfoRepository.deleteExceptionData(request.getOrg_id(), c, null, null);
            userPathInfoRepository.deleteExceptionData(request.getOrg_id(), c, null, null);
        }

    }

    public String getTutorUserState(String org_id, String user_id, String user_grd) {

        return userInfoMapperRepository.selectTutorUserState(org_id, user_id, user_grd);
    }

    public String getTutorUserClassGbn(String org_id, String user_id, String user_grd) {

        return userInfoMapperRepository.selectTutorUserClassGbn(org_id, user_id, user_grd);
    }

    public List<String> getTutorUserTestLevelList(String org_id, String user_id, String user_grd) {
        return userQstInfoRepository.selectTutorUserTestLevel(org_id, user_id, user_grd);
    }

    public List<UserTestListDto> getTutorStudentResultDto(String org_id, String user_id, String user_grd, List<String> userTestLevelList) {

        List<UserTestListDto> userTestListDto = new ArrayList<>();

        for (String userTestLevel : userTestLevelList) {
            TutorStudentRequestDto request = new TutorStudentRequestDto(org_id, user_id, user_grd, userTestLevel);
            // depth3 가져오기
            List<QstListDto> qstList = userQstInfoRepository.selectTutorQstInfo(request);

            // 임시저장여부 파악 (0:임시, 1:제출)
            List<String> tempGbn = userQstInfoRepository.selectTutorGbnInfo(request);

            String testYN = null;
            testYN = getTestYN(tempGbn, testYN);

            // 소요시간 파악
            String leadTime = userPathInfoRepository.selectTutorLeadTime(request);

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

    public Object selectTuStPathInfo(String org_id, String user_id, String user_grd){
        String pathInfo = userPathInfoRepository.selectTuStPathInfo(org_id, user_id, user_grd);

        if (pathInfo == null || pathInfo.equals("")) {
            return "";
        }

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


}
