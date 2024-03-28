package com.agilesoda.aitutor.service;

import com.agilesoda.aitutor.domain.UserAnswerHistory;
import com.agilesoda.aitutor.domain.UserQstHistory;
import com.agilesoda.aitutor.dto.student.HistoryAnswerRequestDto;
import com.agilesoda.aitutor.repository.mapper.UserAnswerHistoryRepository;
import com.agilesoda.aitutor.repository.mapper.UserQstHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
public class HistoryService {

    @Autowired
    UserQstHistoryRepository userQstHistoryRepository;

    @Autowired
    UserAnswerHistoryRepository userAnswerHistoryRepository;

    public int createQstHistory(UserQstHistory userQstHistory) {

        return userQstHistoryRepository.createQstHistory(userQstHistory);
    }

    public int updateQstHistory(UserQstHistory userQstHistory) {
        return userQstHistoryRepository.updateQstHistory(userQstHistory);
    }

//    public void setChgyn(UserQstInfo userQstInfo) {
//        UserQstHistory userQstHistory = new UserQstHistory();
//        userQstHistory.setChgYn(userQstInfo);
//        userQstHistoryRepository.updateChgYn(userQstHistory);
//    }

    public int createAnswerHistory(HistoryAnswerRequestDto historyAnswerRequestDto) {
        return userAnswerHistoryRepository.createAnswerHistory(historyAnswerRequestDto);
    }
}
