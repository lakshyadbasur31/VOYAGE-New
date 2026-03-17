package com.voyage.voyage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/budget")
public class BudgetController {

    private double totalBudget = 0;
    private double totalSpent = 0;

    @GetMapping
    public String budgetPage() {
        return "budget";
    }

    @PostMapping("/set")
    public String setBudget(@RequestParam String tripName,
                            @RequestParam double totalBudget) {
        this.totalBudget = totalBudget;
        this.totalSpent = 0;
        System.out.println("Trip: " + tripName + " Budget: " + totalBudget);
        return "redirect:/budget";
    }

    @PostMapping("/addExpense")
    public String addExpense(@RequestParam String category,
                             @RequestParam double amount) {
        totalSpent += amount;
        System.out.println(category + " Expense: " + amount);
        System.out.println("Total Spent: " + totalSpent);

        if (totalSpent > totalBudget) {
            System.out.println("⚠ Budget exceeded!");
        }
        return "redirect:/budget";
    }
}
