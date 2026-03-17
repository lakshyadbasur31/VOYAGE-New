package com.voyage.voyage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyage.voyage.model.Conversation;
import com.voyage.voyage.model.Message;

public interface MessageRepository 
        extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderByTimestamp(Conversation conversation);
}
