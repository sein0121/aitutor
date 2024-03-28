package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.util.DateTimeHelper;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.user.UserInfoDto;
import com.agilesoda.aitutor.repository.jpa.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserInfoService implements UserDetailsService {

    private final UserInfoRepository userInfoRepository;

    /**
     * Spring Security 필수 메소드 구현
     *
     * @param username 이메일
     * @return UserDetails
     * @throws UsernameNotFoundException 유저가 없을 때 예외 발생
     */
    @Override // 기본적인 반환 타입은 UserDetails, UserDetails를 상속받은 UserInfo로 반환 타입 지정 (자동으로 다운 캐스팅됨)
    public UserInfo loadUserByUsername(String username) throws UsernameNotFoundException { // 시큐리티에서 지정한 서비스이기 때문에 이 메소드를 필수로 구현
        log.info("로그인 시도 => orgId/userId : {}", username);
        String orgId = username.split("/")[0];
        String userId = username.split("/")[1];
        return userInfoRepository.findByUserIdAndOrgId(userId, orgId)
                .orElseThrow(() -> new UsernameNotFoundException((username)));
    }

    /**
     * 회원정보 저장
     *
     * @param infoDto 회원정보가 들어있는 DTO
     * @return 저장되는 회원의 PK
     */
    public String save(UserInfoDto infoDto) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        infoDto.setPassword(encoder.encode(infoDto.getPassword()));

        try {
            return userInfoRepository.save(UserInfo.builder()
                    .username(infoDto.getOrgId()+"/"+infoDto.getUserId())
                    .orgId(infoDto.getOrgId())
                    .userId(infoDto.getUserId())
                    .userType(infoDto.getUserType())
                    .userNm(infoDto.getUserNm())
                    .userGrd(infoDto.getUserGrd())
                    .userTestGrd(infoDto.getUserTestGrd())
                    .classId(infoDto.getClassId())
                    .email(infoDto.getEmail())
                    .password(infoDto.getPassword())
                    .userPhone(infoDto.getUserPhone())
                    .userState(infoDto.getUserState())
                    .auth(infoDto.getAuth())
                    .createDate(DateTimeHelper.getDateTimeNow())
                    .build()).getUsername();
        } catch (Exception e){
            return e.getMessage();
        }
    }
}
