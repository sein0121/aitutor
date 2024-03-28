package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.util.DataHelper;
import com.agilesoda.aitutor.dto.admin.*;
import com.agilesoda.aitutor.dto.student.QstListDto;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.repository.mapper.ClassInfoRepository;
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
public class AdminStudentManagementService {

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    ClassInfoRepository classInfoRepository;

    public List<String> getAllStudentList(String org_id, String user_id) {
        return userInfoMapperRepository.selectAllStudentInfo(org_id, user_id);
    }

    public TutorStudentManageDto getStudentList(String org_id, String user_id) {
        TutorStudentManageDto response = null;


        StudentListRequestDto request = new StudentListRequestDto(org_id, user_id);
        List<StudentListDto> studentListDto = userInfoMapperRepository.selectAdminStudentInfo(request);

        return TutorStudentManageDto.builder()
                .student_list(studentListDto)
                .build();
    }

    public ClassInfoDto selectClassList(String org_id, String user_id) {
        List<StudentClassInfoDto> classList = userInfoMapperRepository.selectAdminStudentClassList(org_id, user_id);

        ClassInfoDto response = ClassInfoDto.builder()
                .class_list(classList)
                .build();

        return response;
    }

    public IdInfoDto selectIdList(String org_id, String user_id, String class_id){
        List<IdListDto> idList = userInfoMapperRepository.selectIdList(org_id,user_id,class_id);
        IdInfoDto response = IdInfoDto.builder().id_list(idList).build();
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

    public void  deleteStudent(DeleteStudentRequestDto request) {

        List<String> studentList = new ArrayList<>();

        for (int i = 0; i < request.getStudent_id().size(); i++) {
            studentList.add(request.getStudent_id().get(i));
            log.debug("studentList 값 => {}", studentList);
        }

        for (String c : studentList) {
            userInfoMapperRepository.deleteAdminStudent(request.getOrg_id(), c, request.getUser_id());
            userQstInfoRepository.deleteExceptionData(request.getOrg_id(), c, null, null);
            userPathInfoRepository.deleteExceptionData(request.getOrg_id(), c, null, null);
        }

    }

    public List<String> getAllStudentListBySearch(String org_id, String user_id, String search_type, String search_nm) {
        switch (search_type) {
            case "all":
                return userInfoMapperRepository.selectAllStudentInfoBySearchAll(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
            case "grade":
                return userInfoMapperRepository.selectAllAdminStudentInfoBySearchGrade(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
            case "class":
                return userInfoMapperRepository.selectAllAdminStudentInfoBySearchClass(org_id, user_id, search_type, DataHelper.searchLike(search_nm));
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
            StudentListDto studentListDto = userInfoMapperRepository.selectAdminStudentSearchInfo(request);

            list.add(studentListDto);
        }

        response.setSearch_list(list);
        return response;
    }

    //상세
    public String getUserState(String org_id, String user_id, String user_grd) {
        return userInfoMapperRepository.selectTutorUserState(org_id, user_id, user_grd);
    }

    public String getTutorUserClassGbn(String org_id, String user_id, String user_grd) {

        return userInfoMapperRepository.selectTutorUserClassGbn(org_id, user_id, user_grd);
    }

    public List<String> getUserTestLevelList(String org_id, String user_id, String user_grd){
        return userQstInfoRepository.selectTutorUserTestLevel(org_id, user_id, user_grd);
    }

    public List<UserTestListDto> getStudentResultDto(String org_id, String user_id, String user_grd, List<String> userTestLevelList) {

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

    public AdminClassChangeDto selectClassChangeList(String org_id) {
        List<AdminClassChangeInfoDto> classList = userInfoMapperRepository.selectClassChangeList(org_id);

        AdminClassChangeDto response = AdminClassChangeDto.builder().class_list(classList).build();

        return response;
    }

    public void updateClassSameTutor (ChangeClassSameTutorDto request){
        AdminClassChangeInfoDto changeList = classInfoRepository. changeAndminClass(request.getOrg_id(),request.getStudent_id(), request.getUser_type(), request.getStudent_grd(), request.getClass_id(), request.getTeacher_id(), request.getNew_teacher_id());
    }

}
