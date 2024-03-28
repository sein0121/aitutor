package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.domain.UserQstInfo;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.dto.StudentResultRequestDto;
import com.agilesoda.aitutor.dto.student.QstInfoDto;
import com.agilesoda.aitutor.dto.student.QstListDto;
import com.agilesoda.aitutor.dto.student.QstResultDto;
import com.agilesoda.aitutor.dto.tutor.TutorStudentRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface UserQstInfoRepository {

    List<QstInfoDto> selectTestQstList(RequestDto request);

    List<String> selectUserTestLevel(String org_id, String user_id, String user_grd, String user_test_grd);

    List<String> selectTutorUserTestLevel(String org_id, String user_id, String user_grd);

    List<QstListDto> selectQstInfo(StudentResultRequestDto studentResultRequestDto);

    List<QstListDto> selectQstInfo(TutorStudentRequestDto tutorStudentRequestDto);

    List<QstListDto> selectTutorQstInfo(TutorStudentRequestDto tutorStudentRequestDto);

    List<String> selectGbnInfo(StudentResultRequestDto studentResultRequestDto);

    List<String> selectGbnInfo(TutorStudentRequestDto tutorStudentRequestDto);

    List<String> selectTutorGbnInfo(TutorStudentRequestDto tutorStudentRequestDto);

    String selectSubmit(UserQstInfo userQstInfo);

    int updateSubmit(UserQstInfo userQstInfo);

    int updateTempGbn(UserQstInfo userQstInfo);

    List<QstResultDto> selectAnswerList(UserQstInfo userQstInfo);

    List<QstResultDto> selectAnswerList2(UserPathInfo userPathInfo);

    List<QstResultDto> selectAnswerListAndQstAnswer(UserQstInfo userQstInfo);

    int saveQst(UserQstInfo qstInfo);

    String checkTestDate(RequestDto request);

    void updateTestDate(String orgId, String userId, String userGrd, String userTestGrd, String userTestLevel, String testDate);

    int selectTempGbnNullCount(UserQstInfo userQstInfo);

    List<String> selectStudentDetail(String org_id, String mgr_id, String user_grd, String user_test_grd);

    String selectUserMaxTestLevel(String org_id, String user_id, String user_grd, String user_test_grd);

    int deleteExceptionData(String orgId, String userId, String userGrd, String userTestGrd);
}
