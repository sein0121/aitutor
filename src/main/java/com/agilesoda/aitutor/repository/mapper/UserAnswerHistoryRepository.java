package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.dto.student.HistoryAnswerRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UserAnswerHistoryRepository {

    int createAnswerHistory(HistoryAnswerRequestDto historyAnswerRequestDto);
}
