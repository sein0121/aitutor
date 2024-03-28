package com.agilesoda.aitutor.config.auth;

import com.agilesoda.aitutor.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserInfoService userInfoService;

    /* 로그인 실패 핸들러 의존성 주입 */
//    private final AuthenticationFailureHandler customFailureHandler;

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers("/css/**", "/js/**", "/image/**", "/json/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
//               .httpBasic().and() // Basic Auth 사용하여 테스트 진행 시 활성화 필요
                .csrf().ignoringAntMatchers("/**")
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()
                .authorizeRequests()
//                .antMatchers("/**").permitAll() // TEST 진행 시 활성화
                .antMatchers("/login", "/logout", "/org-list", "/aitutor/setCookies", "/test/sign-up").permitAll() // 누구나 접근 가능 URL
                .antMatchers("/", "/aitutor/api/v1/student/**", "/aitutor/api/v1/student/user/**", "/aitutor/api/v1/history/**", "/aitutor/api/v1/student/result/**").hasAnyRole("USER", "TUTOR", "ADMIN", "SUPER") // USER, TUTOR, ADMIN, SUPER 접근 가능
                .antMatchers("/aitutor/api/v1/tutor/class/**", "/aitutor/api/v1/tutor/student/**").hasAnyRole("TUTOR", "ADMIN", "SUPER") // TUTOR, ADMIN, SUPER만 접근 가능
                .antMatchers("/aitutor/api/v1/admin/**").hasAnyRole("ADMIN", "SUPER") // ADMIN, SUPER만 접근 가능
                .antMatchers("/aitutor/student/**").hasRole("USER") // SUPER만 접근 가능
                .antMatchers("/aitutor/teacher/**").hasRole("TUTOR") // SUPER만 접근 가능
                .antMatchers("/aitutor/admin/**").hasRole("ADMIN") // SUPER만 접근 가능
                .antMatchers("/aitutor/api/v1/agilesoda/**", "/aitutor/agilesoda/**").hasRole("SUPER") // SUPER만 접근 가능
                .anyRequest().authenticated() // 나머지 요청들은 권한의 종류에 상관 없이 권한이 있어야 접근 가능
                .and()
                .formLogin()
                .loginPage("/login") // 로그인 페이지 링크
                .successHandler(new CustomAuthSuccessHandler())
                .failureHandler(loginFailHandler())
                .defaultSuccessUrl("/", true) // 로그인 성공 후 리다이렉트 주소
//                .failureUrl("/error")
                .and()
                .logout()
                .logoutSuccessUrl("/login") // 로그아웃 성공시 리다이렉트 주소
                .invalidateHttpSession(true) // 세션 날리기
                .and()
                .sessionManagement()
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
                .expiredUrl("/login")
        ;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userInfoService)
                // 해당 서비스(userService)에서는 UserDetailsService를 implements해서
                // loadUserByUsername() 구현해야함 (서비스 참고)
                .passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
        return new ServletListenerRegistrationBean<HttpSessionEventPublisher>(new HttpSessionEventPublisher());
    }

    @Bean
    public CustomAuthFailureHandler loginFailHandler(){
        return new CustomAuthFailureHandler();
    }

//    @Bean
//    public DaoAuthenticationProvider daoAuthenticationProvider() {
//        DaoAuthenticationProvider bean = new DaoAuthenticationProvider();
//        bean.setHideUserNotFoundExceptions(false);
//        bean.setUserDetailsService(userInfoService);
//        bean.setPasswordEncoder(new BCryptPasswordEncoder());
//
//        return bean;
//    }

}
