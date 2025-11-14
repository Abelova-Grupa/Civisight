package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> { }
