package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.config.AppConstant;
import com.agilesoda.aitutor.dto.model.RequestFirstDto;
import com.agilesoda.aitutor.dto.model.RequestQstDto;
import com.agilesoda.aitutor.dto.model.ResponseModelDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ModelCallService {

    @Autowired
    RestTemplate restTemplate;

    // 회원가입 후 1차 테스트 데이터 가져오기
    public ResponseModelDto callFirstQstList(String orgId, String userId, String userTestGrd) {

        String url = AppConstant.AI_TUTOR_URL + AppConstant.AI_TUTOR_QP_FIRST_LIST;

        HttpHeaders header = new HttpHeaders();

        RequestFirstDto requestDto = new RequestFirstDto(orgId, userId, userTestGrd);
        HttpEntity<RequestFirstDto> httpEntity = new HttpEntity<>(requestDto, header);

        return restTemplate.exchange(url, HttpMethod.POST, httpEntity, ResponseModelDto.class).getBody();
    }


    // n차 테스트 후 다음 문항 리스트 or 최종 경로 데이터 가져오기
    public ResponseModelDto callQstList(String orgId, String userId, String userTestGrd, String userTestLevel, List<String> qList, List<Integer> rList) {

        String url = AppConstant.AI_TUTOR_URL + AppConstant.AI_TUTOR_QP_QST_LIST;

        HttpHeaders header = new HttpHeaders();
        RequestQstDto requestQstDto = new RequestQstDto(orgId, userId, userTestGrd, userTestLevel, qList, rList);
        HttpEntity<RequestQstDto> httpEntity = new HttpEntity<>(requestQstDto, header);

        return restTemplate.exchange(url, HttpMethod.POST, httpEntity, ResponseModelDto.class).getBody();
    }
}
