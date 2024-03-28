package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.dto.RequestDto;
import com.agilesoda.aitutor.dto.StudentResultRequestDto;
import com.agilesoda.aitutor.dto.student.AnswerResultDto;
import com.agilesoda.aitutor.dto.student.FinalGraphDto;
import com.agilesoda.aitutor.dto.tutor.TutorStudentRequestDto;
import com.agilesoda.aitutor.dto.user.UserLoginInfoDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface UserPathInfoRepository {

    List<UserPathInfo> selectAll();

    List<UserPathInfo> selectById(String userId);

    int selectTotalTime(RequestDto request);

    String selectPathInfo(String org_id, String user_id, String user_grd, String user_test_grd);

    String selectTuStPathInfo(String org_id, String user_id, String user_grd);

    String selectLeadTime(StudentResultRequestDto studentResultRequestDto);

    String selectLeadTime(TutorStudentRequestDto tutorStudentRequestDto);

    String selectTutorLeadTime(TutorStudentRequestDto tutorStudentRequestDto);

    List<String> selectUserTestLevels(String org_id, String user_id, String user_grd, String user_test_grd);

    List<String> selectTutorUserLevels(String org_id, String user_id, String user_grd);

    int updateResultData(UserPathInfo userPathInfo);

    List<AnswerResultDto> selectResultPath(UserPathInfo userPathInfo);

    int saveInfo(UserPathInfo userPathInfo);

    int updateTotalTime(UserPathInfo userPathInfo);
    // TEST
    String selectTest(UserPathInfo userPathInfo);

    List<FinalGraphDto> selectFinalGraph(String org_id, String user_id, String user_grd, String user_test_grd);

    String selectGraphPath(String org_id, String user_id, String user_grd, String user_test_grd);

    List<UserLoginInfoDto> selectLoginInfo(String orgId, String userId, String userGrd, String userTestGrd);

    int deleteExceptionData(String orgId, String userId, String userGrd, String userTestGrd);
}
