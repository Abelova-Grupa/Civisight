package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.Citizen;
import com.abeliangroup.civisight.model.Problem;
import com.abeliangroup.civisight.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByCitizenIdAndProblemId(Long citizenId, Long problemId);
    Optional<Vote> findByCitizenAndProblem(Citizen citizen, Problem problem);

}