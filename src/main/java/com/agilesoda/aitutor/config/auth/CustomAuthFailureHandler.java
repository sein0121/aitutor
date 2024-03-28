package com.agilesoda.aitutor.config.auth;

import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.service.UserInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

@Slf4j
public class CustomAuthFailureHandler extends SimpleUrlAuthenticationFailureHandler{

    /*
     * HttpServletRequest : request 정보
     * HttpServletResponse : Response에 대해 설정할 수 있는 변수
     * AuthenticationException : 로그인 실패 시 예외에 대한 정보
     */

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        String errorMessage;

        log.debug("username => {}", request.getParameter("username"));
        log.debug("password => {}", request.getParameter("password"));

        if (request.getParameter("username") == null || request.getParameter("username").equals("null") || request.getParameter("username").equals("")) {
            errorMessage = "사용자 ID를 입력해주세요.";
        } else if (request.getParameter("password") == null || request.getParameter("password").equals("null") || request.getParameter("password").equals("")) {
            errorMessage = "비밀번호를 입력해주세요.";
        } else if(exception instanceof BadCredentialsException) {
            errorMessage = "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.";
        } else {
            errorMessage = "알 수 없는 오류로 로그인 요청을 처리할 수 없습니다. 관리자에게 문의하세요.";
        }

        errorMessage = URLEncoder.encode(errorMessage, "UTF-8"); /* 한글 인s코딩 깨진 문제 방지 */
        setDefaultFailureUrl("/login?error=true&orgname="+ request.getParameter("orgName") + "&username="+ request.getParameter("username")+"&exception="+errorMessage);

        super.onAuthenticationFailure(request, response, exception);
    }
}
