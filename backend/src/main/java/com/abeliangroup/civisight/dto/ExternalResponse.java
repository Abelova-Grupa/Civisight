package com.abeliangroup.civisight.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExternalResponse {

    private String status;
    private String classification;
    private String priority;

}