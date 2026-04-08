package com.safehaven.repository;

import com.safehaven.model.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactSubmission, Long> {

    /** Returns all submissions ordered newest-first. */
    List<ContactSubmission> findAllByOrderBySubmittedAtDesc();
}
