package com.abeliangroup.civisight.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlockchainReportRequest {
    private String report_seed;
    private String user_id;
}
