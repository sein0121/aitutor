package com.agilesoda.aitutor.dto.student;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FinalGraphDto {
   private Object final_path;

   @Builder
   public FinalGraphDto(Object graph_path){
       this.final_path=graph_path;
   }
}
