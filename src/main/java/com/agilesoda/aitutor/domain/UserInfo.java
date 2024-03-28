package com.agilesoda.aitutor.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
public class UserInfo implements UserDetails {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(name = "username", unique = true)
    private String username;
    private String orgId; // char(10) NOT NULL조직ID
    private String userId; // varchar(255) NOT NULL 사용자ID
    private String userType; // char(2) NOT NULL 사용자형태
    private String userNm; // varchar(255) NULL 사용자이름
    private String userGrd; // varchar(10) NULL 학년(현재)
    private String userTestGrd; // varchar(10) NULL 테스트학년(현재)
    private String classId; // char(5) NULL 클래스ID
    @Column(name = "user_email", unique = true)
    private String email; // varchar(255) NULL 이메일

    @Column(name = "user_pw")
    private String password; // varchar(255) NULL 패스워드
    private String userPhone; // varchar(255) NULL 전화번호
    private String userState; // char(1) NULL 상태

    @Column(name = "auth")
    private String auth;

    private String createDate;


    @Builder
    public UserInfo(String username, String orgId, String userId, String userType, String userNm, String userGrd, String userTestGrd, String classId, String email, String password, String userPhone, String userState, String auth, String createDate) {
        this.username = username;
        this.orgId = orgId;
        this.userId = userId;
        this.userType = userType;
        this.userNm = userNm;
        this.userGrd = userGrd;
        this.userTestGrd = userTestGrd;
        this.classId = classId;
        this.email = email;
        this.password = password;
        this.userPhone = userPhone;
        this.userState = userState;
        this.auth = auth;
        this.createDate = createDate;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // 사용자의 권한을 콜렉션 형태로 반환
    // 단, 클래스 자료형은 GrantedAuthority를 구현해야함
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> roles = new HashSet<>();
        for (String role : auth.split(",")) {
            roles.add(new SimpleGrantedAuthority(role));
        }
        return roles;
    }

    // 사용자의 id를 반환 (unique한 값)
    @Override
    public String getUsername() {
        return username;
    }

    // 사용자의 password를 반환
    @Override
    public String getPassword() {
        return password;
    }

    // 계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        // 만료되었는지 확인하는 로직
        return true; // true -> 만료되지 않았음
    }

    // 계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        // 계정 잠금되었는지 확인하는 로직
        return true; // true -> 잠금되지 않았음
    }

    // 패스워드의 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        // 패스워드가 만료되었는지 확인하는 로직
        return true; // true -> 만료되지 않았음
    }

    // 계정 사용 가능 여부 반환
    @Override
    public boolean isEnabled() {
        // 계정이 사용 가능한지 확인하는 로직
        if(this.userState.equals("0")){
            return false;
        }
        return true; // true -> 사용 가능
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof UserInfo){
            return this.username.equals(((UserInfo) obj).username);
        }

        return false;
    }

    @Override
    public int hashCode(){
        return this.username.hashCode();
    }

}
