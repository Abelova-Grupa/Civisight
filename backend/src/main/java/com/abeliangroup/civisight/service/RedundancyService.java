package com.abeliangroup.civisight.service;

import com.abeliangroup.civisight.model.Issue;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.model.Urgency;
import com.abeliangroup.civisight.repo.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedundancyService {

    private final IssueRepository issueRepository;

    public boolean isRedundand(Issue issue) {
        double lat = issue.getLatitude();
        double lon = issue.getLongitude();
        Urgency urgency = issue.getUrgency();
        double toleranceLat = lat/100;
        double toleranceLon = lon/100;


        return issueRepository.findAll().stream()
                .filter(existingIssue  -> issue.getUrgency() == urgency)
                .anyMatch(existingIssue  ->
                        lat-toleranceLat <=existingIssue.getLatitude()
                                && lat+toleranceLat <=existingIssue.getLatitude()
                                && lon-toleranceLon <=existingIssue.getLongitude()
                                && lon+toleranceLon <=existingIssue.getLongitude()
                );
    }
}
