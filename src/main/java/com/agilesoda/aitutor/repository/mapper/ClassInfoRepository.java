package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.domain.ClassInfo;
import com.agilesoda.aitutor.dto.admin.AdminClassChangeInfoDto;
import com.agilesoda.aitutor.dto.tutor.ClassDetailInfoDto;
import com.agilesoda.aitutor.dto.tutor.InsertClassRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface ClassInfoRepository {

    int checkExistClass(String org_id, String class_id);

    void deleteClass(String org_id, String class_id, String user_id);

    void deleteClassAdmin(String org_id, String class_id);

    List<String> selectClassName(String org_id);

    void insertClass(InsertClassRequestDto insertClassRequestDto);

    ClassDetailInfoDto getClassDetailInfo(String org_id, String mgr_id, String class_id);

    AdminClassChangeInfoDto changeAndminClass(String org_id, String user_type, String student_id, String student_grd, String class_id, String teacher_id, String new_teacher_id);

    ClassInfo selectClassInfo(String org_id, String class_id);

    String selectMgrId(String org_id, String class_id);

    ClassDetailInfoDto getClassDetailInfoAdmin(String org_id, String class_id);

    List<String> selectAllClassInfo(String org_id, String user_id);

    List<String> selectAllClassInfoAdmin(String org_id, String user_id);

    List<String> selectAllClassInfoBySearchAll(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllClassInfoBySearchGrade(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllClassInfoBySearchClass(String org_id, String user_id, String search_type, String search_nm);

    List<String> selectAllClassInfoBySearchAllAdmin(String org_id, String search_type, String search_nm);

    List<String> selectAllClassInfoBySearchGradeAdmin(String org_id, String search_type, String search_nm);

    List<String> selectAllClassInfoBySearchClassAdmin(String org_id, String search_type, String search_nm);
}
