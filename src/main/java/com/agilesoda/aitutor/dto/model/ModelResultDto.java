package com.agilesoda.aitutor.dto.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ModelResultDto {

    private List<String> next_test_list;
    private ModelPathDto path;

    public ModelResultDto(List<String> next_test_list, ModelPathDto path) {
        this.next_test_list = next_test_list;
        this.path = path;
    }
}
