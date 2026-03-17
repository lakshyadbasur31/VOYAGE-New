package com.voyage.voyage.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyage.voyage.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
    Optional<Trip> findByShareCode(String shareCode);
}