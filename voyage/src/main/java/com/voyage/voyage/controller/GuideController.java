package com.voyage.voyage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class GuideController {

    @GetMapping("/guides")
    public String guidesPage(
            @RequestParam(required = false) String place,
            @RequestParam(required = false) String budget,
            Model model) {

        List<Guide> guides = new ArrayList<>();

        guides.add(new Guide("Rahul Sharma", "Jaipur", "Hindi, English", 1500));
        guides.add(new Guide("Ananya Iyer", "Goa", "English, Tamil", 2000));
        guides.add(new Guide("Arjun Patel", "Delhi", "Hindi, English", 1200));
        guides.add(new Guide("Sofia Muller", "Berlin", "English, German", 3000));
        guides.add(new Guide("Claire Dubois", "Paris", "English, French", 3200));

        // Filter logic
        if (place != null && !place.isEmpty()) {
            guides.removeIf(g -> !g.getPlace().equalsIgnoreCase(place));
        }

        if (budget != null && !budget.isEmpty()) {
            int maxBudget = Integer.parseInt(budget);
            guides.removeIf(g -> g.getPrice() > maxBudget);
        }

        model.addAttribute("guides", guides);
        return "guides";
    }

    // Inner class (simple & safe)
    static class Guide {
        private String name;
        private String place;
        private String language;
        private int price;

        public Guide(String name, String place, String language, int price) {
            this.name = name;
            this.place = place;
            this.language = language;
            this.price = price;
        }

        public String getName() { return name; }
        public String getPlace() { return place; }
        public String getLanguage() { return language; }
        public int getPrice() { return price; }
    }
}
