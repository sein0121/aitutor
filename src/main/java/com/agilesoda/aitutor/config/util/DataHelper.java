package com.agilesoda.aitutor.config.util;

public class DataHelper {

    public static String searchLike(String str) {
        if(str != null && !str.equals("")){
            return "%#"+str+"%";
        } else {
            return "%"+str+"%";
        }
    }
}
