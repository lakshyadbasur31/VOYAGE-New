package com.voyage.voyage.repository;

import com.voyage.voyage.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalRepository extends JpaRepository<JournalEntry, Integer> {
}