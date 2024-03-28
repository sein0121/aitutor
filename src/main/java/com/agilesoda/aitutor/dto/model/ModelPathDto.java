package com.agilesoda.aitutor.dto.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ModelPathDto {

    private Object path_nm;
    private Object path_id;
    private Object graph_info;

    public ModelPathDto(Object path_nm, Object path_id, Object graph_info) {
        this.path_nm = path_nm;
        this.path_id = path_id;
        this.graph_info = graph_info;
    }
}
