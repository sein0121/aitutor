package com.agilesoda.aitutor.controller.admin;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.dto.ApiResponse;
import com.agilesoda.aitutor.dto.OrgListSearchResponseDto;
import com.agilesoda.aitutor.dto.user.OrgListResponseDto;
import com.agilesoda.aitutor.repository.mapper.OrgInfoRepository;
import com.agilesoda.aitutor.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Slf4j
@Controller
public class LoginController {

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    OrgInfoRepository orgInfoRepository;

//    @PostMapping("/user")
//    public String signup(UserInfoDto infoDto) { // 회원 추가
//        userInfoService.save(infoDto);
//        return "redirect:/pages/login";
//    }

    // LOG-02 : 로그인 API
    @GetMapping("/login")
    public String login(
            @RequestParam(value = "error", required = false) String error,

            @RequestParam(value = "exception", required = false) String exception,
                        Model model) {

        /* 에러와 예외를 모델에 담아 view resolve */
        model.addAttribute("error", error);
        model.addAttribute("exception", exception);
        return "pages/login";
    }

    // LOG-03 : 로그아웃
    @GetMapping(value = "/logout")
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return "redirect:pages/login";
    }

    // LOG-01 : 등록 기관 조회 API
    @GetMapping("/org-list")
    public ResponseEntity<ApiResponse> getOrgList() {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);

        try {
            List<OrgListResponseDto> orgList = orgInfoRepository.selectNotNullList();

            OrgListSearchResponseDto response = new OrgListSearchResponseDto(orgList);

            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_SUCCESS, response), resHeaders, HttpStatus.OK));
        } catch (Exception e) {
            return (new ResponseEntity<>(new ApiResponse(AppConstant.RESPONSE_ERROR, null), resHeaders, HttpStatus.BAD_REQUEST));
        }
    }


}
