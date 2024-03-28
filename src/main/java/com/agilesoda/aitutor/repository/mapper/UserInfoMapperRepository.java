package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.ClassListRequestDto;
import com.agilesoda.aitutor.dto.admin.*;
import com.agilesoda.aitutor.dto.student.UserMyPageResponseDto;
import com.agilesoda.aitutor.dto.StudentResultRequestDto;
import com.agilesoda.aitutor.dto.student.UserTestListDto;
import com.agilesoda.aitutor.dto.tutor.*;
import com.agilesoda.aitutor.dto.user.UserPasswordResetRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
@Mapper
public interface UserInfoMapperRepository {

    List<String> selectAllStudentInfoBySearchAll(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllStudentInfoBySearchGrade(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllStudentInfoBySearchClass(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllAdminStudentInfoBySearchGrade(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllAdminStudentInfoBySearchClass(String org_id, String user_id, String search_type, String search_nm);

    ClassListDto selectClassInfo(ClassListRequestDto request);

    String selectUserPassword(UserInfo userInfo);

    List<StudentResultRequestDto> selectStudentList(ClassListRequestDto request);

    List<String> selectAllStudentInfo(String org_id, String user_id);

    List<StudentListDto> selectStudentInfo(StudentListRequestDto request);

    List<StudentListDto> selectAdminStudentInfo(StudentListRequestDto request);

    StudentListDto selectStudentSearchInfo(StudentListRequestDto request);

    StudentListDto selectAdminStudentSearchInfo(StudentListRequestDto request);

    UserMyPageResponseDto selectMyPageInfo(UserInfo userInfo);

    int updatePassword(UserInfo userInfo);

    List<UserListDto> selectUserList(String org_id, String classId);

    int selectOverlapStudentName(String orgId, String studentId);

    int countStudent(ClassListRequestDto request);

    List<UserTestListDto> selectTestlist(String org_id, String studentId);

    List<StudentClassInfoDto> selectClassList(String org_id, String user_id);

    List<AdminClassChangeInfoDto> selectClassChangeList(String org_id);

    List<StudentClassInfoDto> selectAdminStudentClassList(String org_id, String user_id);

    String selectUserState(String org_id, String user_id, String user_grd, String user_test_grd);

    String selectTutorUserState(String org_id, String user_id, String user_grd);

    String selectTutorUserClassGbn(String org_id, String user_id, String user_grd);

    List<String> studentDetailSave(String org_id, String user_id, String user_state, String new_password, String user_grd, String user_test_grd);

    int deleteStudent(String org_id, String student_id,String user_id);

    int deleteAdminStudent(String org_id, String student_id,String user_id);

    List<IdListDto> selectIdList(String org_id, String user_id, String class_id);

    int studentPwReset(UserPasswordResetRequestDto userPasswordResetRequestDto);

    AdminClassListDto selectClassInfos(ClassListRequestDto request);

    List<SuperAdminUserDto> selectUserInfoList(String org_id, String user_type);

    List<TutorList> selectTutorInfo(String org_id, String user_type);

    int resetPassword(String org_id, String user_id, String user_pw);

//    List<String> selectTutorUserState(String org_id, String user_id, String user_grd);

    TutorMyPageResponseDto selectTutorName(UserInfo userInfo);

    HashMap<String, Object> selectUserName(UserInfo userInfo);

    int selectUserNameCount(String org_id, String user_name);

    String selectUserNm(String org_id, String mgrId);

    int checkExistStudent(String org_id, String class_id);

    String selectTeacherName(String orgId, String userId, String userType);
}
