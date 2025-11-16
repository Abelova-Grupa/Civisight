package com.abeliangroup.civisight.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlockchainSolidityReport {
    private Double lat;
    private Double lon;
    private Integer priority;
}
