package com.agilesoda.aitutor.controller;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.domain.UserInfo;
import com.agilesoda.aitutor.dto.user.UserLoginInfoDto;
import com.agilesoda.aitutor.repository.mapper.OrgInfoRepository;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.websocket.server.PathParam;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Slf4j
@Controller
public class ViewController {

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    @Autowired
    OrgInfoRepository orgInfoRepository;

    @GetMapping("/")
    public String index(Model model, @AuthenticationPrincipal UserInfo userInfo) {
        log.debug("index page 접근");
        model.addAttribute("org_id", userInfo.getOrgId());
        model.addAttribute("org_nm", orgInfoRepository.selectOrgNm(userInfo.getOrgId()));
        model.addAttribute("user_id", userInfo.getUserId());
        model.addAttribute("user_nm", userInfo.getUserNm());
        model.addAttribute("user_type", userInfo.getUserType());
        model.addAttribute("user_grade", userInfo.getUserGrd());
        model.addAttribute("user_test_grade", userInfo.getUserTestGrd());


        if (userInfo.getAuth().contains("USER")) {
            log.debug("ROLE_USER 로그인");
            // select test단게 order by testlevel desc ->
            // get(0) == 99 : testlevel : get(1), pauseyn : n, testyn : y
            // get(0) != : testlevel : get(0), pauseyn : select path_info -> total_time !=0, testyn : n

            List<UserLoginInfoDto> userTestInfo = userPathInfoRepository.selectLoginInfo(userInfo.getOrgId(), userInfo.getUserId(), userInfo.getUserGrd(), userInfo.getUserTestGrd());

            String user_test_level;
            String user_pause_yn;
            String user_test_yn;

            if (userTestInfo.get(0).getUser_test_level().equals("99")) {
                user_test_level = userTestInfo.get(1).getUser_test_level();
                user_pause_yn = "n";
                user_test_yn = "y";
            } else {
                user_test_level = userTestInfo.get(0).getUser_test_level();
                if (userTestInfo.get(0).getTotal_time() != 0) {
                    user_pause_yn = "y";
                } else {
                    user_pause_yn = "n";
                }
                user_test_yn = "n";

            }

            model.addAttribute("user_test_level", user_test_level);
            model.addAttribute("user_pause_yn", user_pause_yn);
            model.addAttribute("user_test_yn", user_test_yn);

            return "pages/setCookies";
        } else if (userInfo.getAuth().contains("TUTOR")) {
            log.debug("ROLE_TUTOR 로그인");
            return "pages/setCookies";
        } else if (userInfo.getAuth().contains("ADMIN")) {
            log.debug("ROLE_ADMIN 로그인");
            return "pages/setCookies";
        } else if (userInfo.getAuth().contains("SUPER")) {
            log.debug("ROLE_SUPER 로그인");
            return "pages/setCookies";
        } else {
            log.debug("확인 안된 유저");
            return "pages/setCookies";
        }

    }

    @GetMapping("/aitutor/{page}")
    public String loginPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/student/{page}")
    public String studentPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/teacher/{page}")
    public String teacherPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/teacher/class/{page}")
    public String tClassPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/teacher/student/{page}")
    public String tStudentPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/admin/{page}")
    public String adminPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/admin/class/{page}")
    public String aClassPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/admin/student/{page}")
    public String aStudentPage(@PathVariable String page) {
        return "pages/" + page;
    }

    @GetMapping("/aitutor/agilesoda/{page}")
    public String agilesodaPage(@PathVariable String page) {
        return "pages/" + page;
    }


    @GetMapping(value = "/front/image")
    public ResponseEntity<InputStreamResource> getImage(@PathParam("filePath") String filePath) throws IOException {
        // TODO: 로컬 url 수정 사항
//        InputStream in = new FileInputStream("/volumes/twinreader_input/" + filePath);
        InputStream in = new FileInputStream(AppConstant.AI_TUTOR_IMAGE_PATH + filePath);

        MediaType contentType;

        String fileExtension = filePath.substring(filePath.lastIndexOf(".") + 1);
        switch (fileExtension) {
            case "jpg": // 1 인 경우
                contentType = MediaType.IMAGE_JPEG;
                break;
            case "png": // 2 인 경우
                contentType = MediaType.IMAGE_PNG;
                break;
            default:
                contentType = MediaType.IMAGE_JPEG;
                break;
        }

        return ResponseEntity.ok()
                .contentType(contentType)
                .body(new InputStreamResource(in));
    }

}
