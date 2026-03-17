package com.voyage.voyage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyage.voyage.model.Guide;

public interface GuideRepository extends JpaRepository<Guide, Long> {
}
