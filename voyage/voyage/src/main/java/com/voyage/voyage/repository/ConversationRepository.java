package com.voyage.voyage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyage.voyage.model.Conversation;

public interface ConversationRepository 
        extends JpaRepository<Conversation, Long> {
}
