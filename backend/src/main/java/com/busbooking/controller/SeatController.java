package com.busbooking.controller;

import com.busbooking.entity.Seat;
import com.busbooking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/{busId}")
    public ResponseEntity<List<Seat>> getSeatsByBusId(@PathVariable Long busId) {
        return ResponseEntity.ok(seatService.getSeatsByBusId(busId));
    }
}
