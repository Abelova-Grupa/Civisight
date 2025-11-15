package com.abeliangroup.civisight.controller;

import com.abeliangroup.civisight.dto.MapDataDTO;
import com.abeliangroup.civisight.dto.ProblemDTO;
import com.abeliangroup.civisight.repo.IssueRepository;
import com.abeliangroup.civisight.repo.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MapController {

    private final ProblemRepository problemRepository;
    private final IssueRepository issueRepository;


    @GetMapping
    public List<MapDataDTO> getMapData() {
        return issueRepository.findAll()
            .stream()
            .map(MapDataDTO::toDTO)
            .collect(Collectors.toList());
    }

}
