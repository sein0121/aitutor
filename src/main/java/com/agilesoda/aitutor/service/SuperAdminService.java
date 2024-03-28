package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.dto.admin.OrgListDto;
import com.agilesoda.aitutor.dto.admin.SuperAdminOrgListDto;
import com.agilesoda.aitutor.dto.admin.SuperAdminUserDto;
import com.agilesoda.aitutor.dto.user.OrgListResponseDto;
import com.agilesoda.aitutor.repository.mapper.OrgInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserInfoMapperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class SuperAdminService {

    @Autowired
    OrgInfoRepository orgInfoRepository;

    @Autowired
    UserInfoMapperRepository userInfoMapperRepository;

    public List<SuperAdminOrgListDto> getOrgUserInfo() {
        // org_list
        // -> org_id, org_nm, user_list
        // -> user_list : user_id, user_type, user_nm

        List<SuperAdminOrgListDto> result = new ArrayList<>();

        List<OrgListResponseDto> orgList = orgInfoRepository.selectAll();

        for (OrgListResponseDto dto : orgList) {
            List<SuperAdminUserDto> user_list = userInfoMapperRepository.selectUserInfoList(dto.getOrg_id(), AppConstant.USER_TYPE_STUDENT);
            result.add(new SuperAdminOrgListDto(dto.getOrg_id(), dto.getOrg_nm(), user_list));
        }

        return result;

    }

    public void updateOrgName(List<OrgListDto> orgList) {

        for (OrgListDto dto : orgList) {
            orgInfoRepository.updateOrgName(dto.getOrg_id(), dto.getOrg_nm());
        }
    }
}
