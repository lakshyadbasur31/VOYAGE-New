package com.voyage.voyage.controller;

import com.voyage.voyage.entity.*;
import com.voyage.voyage.repository.*;
import com.voyage.voyage.service.PhotoService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/journal")
public class JournalController {

    private final TripRepository tripRepo;
    private final MemoryRepository memoryRepo;
    private final PhotoService photoService;

    public JournalController(TripRepository tripRepo, MemoryRepository memoryRepo, PhotoService photoService) {
        this.tripRepo = tripRepo;
        this.memoryRepo = memoryRepo;
        this.photoService = photoService;
    }

    @GetMapping
    public String journalPage() {
        return "journal";
    }

    // CREATE TRIP + FIRST MEMORY (SINGLE FLOW)
    @PostMapping("/create")
    @ResponseBody
    public Trip createTrip(
            @RequestParam String tripTitle,
            @RequestParam String memoryTitle,
            @RequestParam String memoryDesc,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "false") boolean groupTrip,
            @RequestParam(required = false) MultipartFile photo
    ) throws Exception {
        Trip trip = new Trip();
        trip.setTitle(tripTitle);
        trip.setLatitude(lat);
        trip.setLongitude(lng);
        trip.setGroupTrip(groupTrip);
        if (groupTrip) {
            trip.setShareCode(UUID.randomUUID().toString().substring(0, 6));
        }
        trip = tripRepo.save(trip);

        Memory memory = new Memory();
        memory.setTitle(memoryTitle);
        memory.setDescription(memoryDesc);
        memory.setTrip(trip);
        memory = memoryRepo.save(memory);

        if (photo != null && !photo.isEmpty()) {
            photoService.savePhoto(memory.getId(), photo);
        }

        return trip;
    }

    // ALL TRIPS (MAP PINS)
    @GetMapping("/trips")
    @ResponseBody
    public List<Trip> allTrips() {
        return tripRepo.findAll();
    }

    // MEMORIES FOR A TRIP
    @GetMapping("/trip/{id}/memories")
    @ResponseBody
    public List<Memory> tripMemories(@PathVariable Long id) {
        return memoryRepo.findByTrip_Id(id);
    }

    // DELETE TRIP
    @DeleteMapping("/trip/{id}")
    @ResponseBody
    public void deleteTrip(@PathVariable Long id) {
        tripRepo.deleteById(id);
    }

    // GROUP TRIP ACCESS
    @GetMapping("/group/{code}")
    public String groupTrip(@PathVariable String code) {
        return "journal";
    }

    // GET GROUP TRIP BY SHARE CODE
    @GetMapping("/group/{code}/trip")
    @ResponseBody
    public Trip getGroupTrip(@PathVariable String code) {
        return tripRepo.findByShareCode(code).orElseThrow();
    }

    // ADD MEMORY TO GROUP TRIP
    @PostMapping("/group/{code}/memory")
    @ResponseBody
    public void addGroupMemory(
            @PathVariable String code,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile photo
    ) throws Exception {
        Trip trip = tripRepo.findByShareCode(code).orElseThrow();

        Memory memory = new Memory();
        memory.setTitle(title);
        memory.setDescription(description);
        memory.setTrip(trip);
        memory = memoryRepo.save(memory);

        if (photo != null && !photo.isEmpty()) {
            photoService.savePhoto(memory.getId(), photo);
        }
    }
}
