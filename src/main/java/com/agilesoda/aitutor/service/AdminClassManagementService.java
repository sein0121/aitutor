package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.config.util.DataHelper;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.ClassListRequestDto;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.dto.StudentResultRequestDto;
import com.agilesoda.aitutor.dto.admin.AdminClassListDto;
import com.agilesoda.aitutor.dto.admin.AdminClassListResultDto;
import com.agilesoda.aitutor.dto.admin.AdminSearchClassListResultDto;
import com.agilesoda.aitutor.dto.student.QstResultDto;
import com.agilesoda.aitutor.dto.tutor.ClassDetailInfoDto;
import com.agilesoda.aitutor.dto.tutor.DeleteClassRequestDto;
import com.agilesoda.aitutor.dto.tutor.UserListDto;
import com.agilesoda.aitutor.repository.mapper.ClassInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminClassManagementService {

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    @Autowired
    UserQstInfoRepository userQstInfoRepository;

    @Autowired
    ClassInfoRepository classInfoRepository;

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    public List<String> getAllClassList(String org_id, String user_id) {
        return classInfoRepository.selectAllClassInfoAdmin(org_id, user_id);
    }

    public AdminClassListResultDto getClassList(String org_id, List<String> allClassList) {

        List<AdminClassListDto> adminClassListDto = new ArrayList<>();

        for (int k = 0; k < allClassList.size(); k++) {

            log.debug("class 명 => {}", allClassList.get(k));

            ClassListRequestDto request = new ClassListRequestDto(org_id, allClassList.get(k), AppConstant.USER_TYPE_STUDENT);    // 학생 인원만 카운트
            adminClassListDto.add(userInfoMapperRepository.selectClassInfos(request));
            int stuCount = userInfoMapperRepository.countStudent(request);
            adminClassListDto.get(k).setClass_count(String.valueOf(stuCount));

            String mgrId = classInfoRepository.selectMgrId(org_id, allClassList.get(k));
            String userNm = userInfoMapperRepository.selectUserNm(org_id, mgrId);
            adminClassListDto.get(k).setUser_nm(userNm);

            // 클래스에 속한 학생 정보 가져오기
            List<StudentResultRequestDto> allStudentInfo = userInfoMapperRepository.selectStudentList(request);
            log.debug("학생 정보 리스트 => {}", allStudentInfo);

            int completedCount = 0;
            double testRate = 0;

            if (allStudentInfo != null) {

                for (int i = 0; i < allStudentInfo.size(); i++) {
                    // 경로 여부 확인
                    List<String> userTestLevelLists = userPathInfoRepository.selectUserTestLevels(allStudentInfo.get(i).getOrg_id(), allStudentInfo.get(i).getUser_id(), allStudentInfo.get(i).getUser_grd(), allStudentInfo.get(i).getUser_test_grd());
                    log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

                    // 최종 경로 여부(99) 확인
                    if (userTestLevelLists.contains("99")) {
                        completedCount++;
                    } else {
                        log.debug("클래스 목록 조회 API - 테스트 미완료 학생 => {}", allStudentInfo.get(i).getUser_id());
                    }
                }
            }

            // 테스트 완료 학생이 존재할 경우, 테스트 완료율 계산
            if (completedCount > 0) {
                // 클래스 학생 총 인원
                int studentCount = Integer.parseInt(adminClassListDto.get(k).getClass_count());
                log.debug("총 학생 수 => {}", studentCount);
                log.debug("테스트 완료 학생 수 => {}", completedCount);

                // 테스트 완료율 계산
                testRate = ((double)completedCount / studentCount) * 100;
                log.debug("test_rate 값 => {}", testRate);
            }

            log.debug("test_rate 값 => {}", testRate);
            adminClassListDto.get(k).setTest_rate(Integer.toString((int)testRate));


        }

        return AdminClassListResultDto.builder()
                .class_list(adminClassListDto)
                .build();
    }

    public AdminSearchClassListResultDto getSearchClassList(String org_id, List<String> allClassList) {

        List<AdminClassListDto> adminClassListDto = new ArrayList<>();

        for (int k = 0; k < allClassList.size(); k++) {

            log.debug("class 명 => {}", allClassList.get(k));

            ClassListRequestDto request = new ClassListRequestDto(org_id, allClassList.get(k), AppConstant.USER_TYPE_STUDENT);    // 학생 인원만 카운트
            adminClassListDto.add(userInfoMapperRepository.selectClassInfos(request));
            int stuCount = userInfoMapperRepository.countStudent(request);
            adminClassListDto.get(k).setClass_count(String.valueOf(stuCount));
            log.debug("stucount => {}", stuCount);

            String mgrId = classInfoRepository.selectMgrId(org_id, allClassList.get(k));
            String userNm = userInfoMapperRepository.selectUserNm(org_id, mgrId);
            adminClassListDto.get(k).setUser_nm(userNm);

            // 클래스에 속한 학생 정보 가져오기
            List<StudentResultRequestDto> allStudentInfo = userInfoMapperRepository.selectStudentList(request);
            log.debug("학생 정보 리스트 => {}", allStudentInfo);

            int completedCount = 0;
            double testRate = 0;

            if (allStudentInfo != null) {
                for (int i = 0; i < allStudentInfo.size(); i++) {
                    // 경로 여부 확인
                    List<String> userTestLevelLists = userPathInfoRepository.selectUserTestLevels(allStudentInfo.get(i).getOrg_id(), allStudentInfo.get(i).getUser_id(), allStudentInfo.get(i).getUser_grd(), allStudentInfo.get(i).getUser_test_grd());
                    log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

                    // 최종 경로 여부(99) 확인
                    if (userTestLevelLists.contains("99")) {
                        completedCount++;
                    } else {
                        log.debug("클래스 목록 조회 API - 테스트 미완료 학생 => {}", allStudentInfo.get(i).getUser_id());
                    }
                }
            }

            // 테스트 완료 학생이 존재할 경우, 테스트 완료율 계산
            if (completedCount > 0) {
                // 클래스 학생 총 인원
                int studentCount = Integer.parseInt(adminClassListDto.get(k).getClass_count());
                log.debug("총 학생 수 => {}", studentCount);
                log.debug("테스트 완료 학생 수 => {}", completedCount);

                // 테스트 완료율 계산
                testRate = ((double)completedCount / studentCount) * 100;
                log.debug("test_rate 값 => {}", testRate);
            }

            log.debug("test_rate 값 => {}", testRate);
            adminClassListDto.get(k).setTest_rate(Integer.toString((int)testRate));

        }

        return AdminSearchClassListResultDto.builder()
                .search_list(adminClassListDto)
                .build();
    }

    public List<String> getAllClassListBySearchAdmin(String org_id, String search_type, String search_nm) {

        switch (search_type) {
            case "all":
                return classInfoRepository.selectAllClassInfoBySearchAllAdmin(org_id, search_type, DataHelper.searchLike(search_nm));
            case "grade":
                return classInfoRepository.selectAllClassInfoBySearchGradeAdmin(org_id, search_type, DataHelper.searchLike(search_nm));
            case "class":
                return classInfoRepository.selectAllClassInfoBySearchClassAdmin(org_id, search_type, DataHelper.searchLike(search_nm));
            default:
                return null;
        }
    }

    public ClassDetailInfoDto getClassDetailInfo(String org_id, String class_id) {

        ClassDetailInfoDto response = null;

        int studentCount = 0;
        int completedCount = 0;
        double testRate = 0;
        String finalPathYn = null;

        try {

            // depth1
            ClassDetailInfoDto classDetailInfo = classInfoRepository.getClassDetailInfoAdmin(org_id, class_id);

            // class count
            ClassListRequestDto request = new ClassListRequestDto(org_id, class_id, AppConstant.USER_TYPE_STUDENT);
            studentCount = userInfoMapperRepository.countStudent(request);

            log.debug("studentCount 값 => {}", studentCount);

            // userlist
            List<UserListDto> userlist = userInfoMapperRepository.selectUserList(org_id, class_id);
            log.debug("userlist 값 => {}", userlist);

            // test rate
            for (int i = 0; i < userlist.size(); i++) {

                // 테스트 완료 여부
                HashMap<String, Object> userTestYn = new HashMap<>();
                String testYn = null;

                // 학생 별 테스트 단계
                String testLevel = userQstInfoRepository.selectUserMaxTestLevel(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd());
                if (testLevel != null) {
                    userlist.get(i).setUser_test_level(testLevel);
                    log.debug("test level 값 => {}", userlist.get(i).getUser_test_level());

                    StudentResultRequestDto requestDto = new StudentResultRequestDto(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd(), testLevel);
                    List<String> tempGbn = userQstInfoRepository.selectGbnInfo(requestDto);
                    testYn = getTestYN(tempGbn, testYn);
                    log.debug("테스트 완료 여부 => {}", testYn);

                    userTestYn.put("level" + testLevel, testYn);
                    userlist.get(i).setUser_test_yn(userTestYn);

                } else {
                    userlist.get(i).setUser_test_level("01");
                    log.debug("test level 값 => {}", userlist.get(i).getUser_test_level());

                    userTestYn.put("level" + testLevel, testYn);
                    userlist.get(i).setUser_test_yn(userTestYn);
                }

                // 경로 여부 확인
                List<String> userTestLevelLists = userPathInfoRepository.selectUserTestLevels(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd());
                log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

                // 최종 경로 여부(99) 확인
                if (userTestLevelLists.contains("99")) {
                    completedCount++;
                } else {
                    log.debug("클래스 목록 조회 API - 테스트 미완료 학생 => {}", userlist.get(i).getUser_id());
                }

                // 테스트 완료 학생이 존재할 경우, 테스트 완료율 계산
                if (completedCount > 0) {

                    // 테스트 완료율 계산
                    testRate = ((double)completedCount / studentCount) * 100;
                    log.debug("test_rate 값 => {}", testRate);
                }

                log.debug("test_rate 값 => {}", testRate);
            }

            // depth2 가져오기
            for(int i = 0; i < userlist.size(); i++) {

                // 경로 여부 확인
                List<String> userTestLevelLists = userPathInfoRepository.selectUserTestLevels(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd());
                log.debug("userTestLevel 리스트 값 => {}", userTestLevelLists);

                // 최종 경로 여부(99) 확인
                if (userTestLevelLists.contains("99")) {
                    finalPathYn = "Y";
                } else {
                    finalPathYn = "N";
                }
                userlist.get(i).setFinal_path_yn(finalPathYn);

                // 학생별 테스트 레벨 리스트
                List<String> testLevelList = userQstInfoRepository.selectUserTestLevel(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd());
                log.debug("학생별 테스트 레벨 리스트 => {}", testLevelList);

                HashMap<String, Object> submitAnswer = new HashMap<>();
                HashMap<String, Object> answer = new HashMap<>();

                if (!testLevelList.isEmpty()) {
                    for (int j = 0; j < testLevelList.size(); j++) {
                        UserQstInfo userQstInfo = new UserQstInfo(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd(), testLevelList.get(j), null, null, null, null, null, null, null, null);
                        List<QstResultDto> qstResultDto = userQstInfoRepository.selectAnswerListAndQstAnswer(userQstInfo);

                        try {
                            if (0 < userPathInfoRepository.selectTotalTime(new RequestDto(org_id, userlist.get(i).getUser_id(), userlist.get(i).getUser_grd(), userlist.get(i).getUser_test_grd(), testLevelList.get(j), null, null, null))) {
                                // 문제 진입을 한번이라도 한 경우

                                List<String> qstId = new ArrayList<>();
                                List<String> submitAnswerList = new ArrayList<>();
                                List<String> answerList = new ArrayList<>();

                                for (QstResultDto q : qstResultDto) {
                                    qstId.add(q.getQstId());
                                    submitAnswerList.add(q.getSubmitAnswer());
                                    answerList.add(q.getQstAnswer());
                                }

                                log.debug("학생별 문제 리스트 => {}", qstId);
                                log.debug("학생별 제출 답안 리스트 => {}", submitAnswerList);
                                log.debug("학생별 문제 정답 리스트 => {}", answerList);

                                submitAnswer.put("level" + testLevelList.get(j), submitAnswerList);
                                answer.put("level" + testLevelList.get(j), answerList);

                                log.debug("제출 답 => {}", submitAnswer);
                                log.debug("정답 => {}", answer);
                            } else {
                                // 진입 안한 경우
                                submitAnswer.put("level" + testLevelList.get(j), null);
                                answer.put("level" + testLevelList.get(j), null);
                            }
                        } catch (Exception e) {
                            log.error("관리자 클래스 상세 API - total_time null 값 => {}", userlist.get(i).getUser_id());
                        }
                    }
                    userlist.get(i).setSubmit_answer(submitAnswer);
                    userlist.get(i).setQst_answer(answer);
                } else {
                    submitAnswer.put("level01", null);
                    answer.put("level01", null);

                    userlist.get(i).setSubmit_answer(submitAnswer);
                    userlist.get(i).setQst_answer(answer);
                }
            }

            response = ClassDetailInfoDto.builder()
                    .class_id(classDetailInfo.getClass_id())
                    .class_nm(classDetailInfo.getClass_nm())
                    .class_gbn(classDetailInfo.getClass_gbn())
                    .class_count(Integer.toString(studentCount))
                    .test_rate(Integer.toString((int)testRate))
                    .user_list(userlist)
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }

    @Transactional
    public int deleteClass(DeleteClassRequestDto request) {

        List<String> classList = new ArrayList<>();
        int checkClass, checkStudent, response = 0;

        for (int i = 0; i < request.getClass_id().size(); i++) {
            classList.add(request.getClass_id().get(i));
            log.debug("classList 값 => {}", classList);
        }

        for (String class_id : classList) {
            checkClass = classInfoRepository.checkExistClass(request.getOrg_id(), class_id);
            log.debug("checkClass 값 => {}", checkClass);

            checkStudent = userInfoMapperRepository.checkExistStudent(request.getOrg_id(), class_id);
            log.debug("checkStudent 값 => {}", checkStudent);

            if (checkClass == 1 && checkStudent == 0) {
                response = AppConstant.RESPONSE_SUCCESS;
            } else if (checkClass == 1 && checkStudent == 1){
                response = AppConstant.RESPONSE_DELETE_DISABLE;
                break;
            } else {
                response = AppConstant.RESPONSE_ERROR;
            }
        }

        if (response == AppConstant.RESPONSE_SUCCESS) {
            for (String class_id : classList) {
                classInfoRepository.deleteClassAdmin(request.getOrg_id(), class_id);
            }
        }

        return response;
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
}
