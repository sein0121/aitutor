package com.agilesoda.aitutor.config.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHelper {

    public static boolean match(String pw1, String pw2){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(pw1, pw2);
    }

    public static String encodePassword(String pw){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(pw);
    }
}
