package com.safehaven.repository;

import com.safehaven.model.Hotline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotlineRepository extends JpaRepository<Hotline, Long> {

    /** Find hotlines by region (case-insensitive). */
    List<Hotline> findByRegionIgnoreCase(String region);
}
