package com.voyage.voyage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.voyage.voyage.entity.Memory;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {

    List<Memory> findByTrip_Id(Long tripId);

}
