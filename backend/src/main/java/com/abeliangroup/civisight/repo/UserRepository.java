package com.abeliangroup.civisight.repo;

import com.abeliangroup.civisight.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for authentication)
    Optional<User> findByEmail(String email);

    // Optional: check if email already exists
    boolean existsByEmail(String email);
}
