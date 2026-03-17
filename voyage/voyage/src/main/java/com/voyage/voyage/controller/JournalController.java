package com.voyage.voyage.controller;

import com.voyage.voyage.model.JournalEntry;
import com.voyage.voyage.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class JournalController {

    @Autowired
    private JournalRepository journalRepository;

    @GetMapping("/journal")
    public String journal(Model model) {
        model.addAttribute("entries", journalRepository.findAll());
        model.addAttribute("entry", new JournalEntry());
        return "journal";
    }

    @PostMapping("/journal/add")
    public String addEntry(@ModelAttribute JournalEntry entry) {
        journalRepository.save(entry);
        return "redirect:/journal";
    }
}