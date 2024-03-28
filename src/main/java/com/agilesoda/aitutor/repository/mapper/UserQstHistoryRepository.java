package com.agilesoda.aitutor.repository.mapper;

import com.agilesoda.aitutor.domain.UserQstHistory;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UserQstHistoryRepository {

    int createQstHistory(UserQstHistory userQstHistory);

    int updateQstHistory(UserQstHistory userQstHistory);

    void updateChgYn(UserQstHistory userQstHistory);
}
