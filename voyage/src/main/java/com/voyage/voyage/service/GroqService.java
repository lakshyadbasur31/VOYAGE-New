package com.voyage.voyage.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GroqService {

    // ✅ Use environment variable (SAFE)
    private static final String API_KEY = System.getenv("GROQ_API_KEY");
    private static final String URL = "https://api.groq.com/openai/v1/chat/completions";

    public String askAI(String userMessage) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.1-8b-instant");

        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of(
                "role", "system",
                "content",
                "You are Voyage, a smart travel assistant. " +
                "Plan trips step by step, include underrated local places, " +
                "packing tips, transport, and speak like a friendly human."
        ));

        messages.add(Map.of(
                "role", "user",
                "content", userMessage
        ));

        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();

        // ✅ Safety check (optional but recommended)
        if (API_KEY == null || API_KEY.isEmpty()) {
            throw new RuntimeException("GROQ_API_KEY is not set in environment variables");
        }

        headers.setBearerAuth(API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(URL, request, Map.class);

        Map<String, Object> resBody = response.getBody();
        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) resBody.get("choices");

        Map<String, Object> msg =
                (Map<String, Object>) choices.get(0).get("message");

        return msg.get("content").toString();
    }
}