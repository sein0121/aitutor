package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.domain.UserPathInfo;
import com.agilesoda.aitutor.repository.mapper.UserPathInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TestService {

    @Autowired
    UserPathInfoRepository userPathInfoRepository;

    public List<UserPathInfo> select(){
        return userPathInfoRepository.selectAll();
    }

    public List<UserPathInfo> select2(String userId){
        return userPathInfoRepository.selectById(userId);
    }
}
