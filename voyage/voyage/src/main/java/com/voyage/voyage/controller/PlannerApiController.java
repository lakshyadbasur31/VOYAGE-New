package com.voyage.voyage.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyage.voyage.service.GroqService;

@RestController
@RequestMapping("/api/planner")
public class PlannerApiController {

    private final GroqService groqService;

    public PlannerApiController(GroqService groqService) {
        this.groqService = groqService;
    }

    @PostMapping("/ask")
    public String askPlanner(@RequestBody String userMessage) {
        return groqService.askAI(userMessage);
    }
}