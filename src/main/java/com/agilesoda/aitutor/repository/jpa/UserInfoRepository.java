package com.agilesoda.aitutor.repository.jpa;

import com.agilesoda.aitutor.domain.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUserId(String email);
    Optional<UserInfo> findByUserIdAndOrgId(String userId, String orgId);
}
