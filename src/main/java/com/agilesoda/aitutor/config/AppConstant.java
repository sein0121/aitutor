package com.agilesoda.aitutor.config;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

/*
 * api key 생성을 위한 서비스 key
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AppConstant {

    public static final int RESPONSE_SUCCESS = 200;
    public static final int RESPONSE_PW_SUCCESS = 210;
    public static final int RESPONSE_PW_FAIL = 211;
    public static final int RESPONSE_ENABLE = 220;
    public static final int RESPONSE_DISABLE = 221;
    public static final int RESPONSE_DELETE_DISABLE = 231;
    public static final int RESPONSE_SIGNUP_ERROR = 241;
    public static final int RESPONSE_ERROR = 999;


    public static final String USER_TYPE_SUPER = "00";
    public static final String USER_TYPE_ADMIN = "10";
    public static final String USER_TYPE_TUTOR = "20";
    public static final String USER_TYPE_STUDENT = "30";

    public static final String ROLE_SUPER = "ROLE_SUPER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_TUTOR = "ROLE_TUTOR";
    public static final String ROLE_USER = "ROLE_USER";

    public static final List<String> TEST_LEVEL_LIST = Arrays.asList("01","02","03");

    public static final String AI_TUTOR_URL = "http://15.164.149.186";
    public static final String AI_TUTOR_QP_FIRST_LIST = "/api/new";
    public static final String AI_TUTOR_QP_QST_LIST = "/api/test";

    public static final String AI_TUTOR_IMAGE_PATH = "/data/aitutor/images";

}
