package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> { }
