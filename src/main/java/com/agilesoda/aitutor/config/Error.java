package com.agilesoda.aitutor.config;


import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class Error implements ErrorController {
    private String ERROR_TEMPLATES_PATH = "error/";

    @RequestMapping(value = "/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if(status != null){
            int statusCode = Integer.valueOf(status.toString());
            if(statusCode == HttpStatus.NOT_FOUND.value()){
                return ERROR_TEMPLATES_PATH + "404";
            }

            if(statusCode == HttpStatus.FORBIDDEN.value()){
                return ERROR_TEMPLATES_PATH + "403";
            }

            if(statusCode == HttpStatus.UNAUTHORIZED.value()){
                // 인증 에러
                return ERROR_TEMPLATES_PATH + "401";
            }

            if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()){
                // 500 에러 (API 로직 에러)
                return ERROR_TEMPLATES_PATH + "500";
            }

        }
        return "error";
    }
}
