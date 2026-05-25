package com.busbooking.controller;

import com.busbooking.entity.Bus;
import com.busbooking.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        try {
            LocalDate travelDate = LocalDate.parse(date);
            List<Bus> buses = busService.searchBuses(source, destination, travelDate);
            return ResponseEntity.ok(buses);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid travel date format. Use YYYY-MM-DD.");
        }
    }
}
