package com.agilesoda.aitutor.dto.tutor;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IdListDto {
   private String student_id;

   public IdListDto(String student_id){

       this.student_id=student_id;
   }
}
