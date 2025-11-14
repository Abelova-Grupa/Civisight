package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> { }
