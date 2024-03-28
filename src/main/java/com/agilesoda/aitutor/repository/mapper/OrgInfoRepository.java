package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.dto.user.OrgListResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface OrgInfoRepository {

    List<OrgListResponseDto> selectAll();

    List<OrgListResponseDto> selectNotNullList();

    String selectOrgNm(String orgId);

    int updateOrgName(String org_id, String org_nm);
}
