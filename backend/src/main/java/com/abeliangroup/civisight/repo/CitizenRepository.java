package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {
    public Optional<Citizen> findByEmail(String email);
    public boolean existsByEmail(String email);
}
