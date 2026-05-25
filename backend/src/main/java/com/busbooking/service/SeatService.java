package com.busbooking.service;

import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import com.busbooking.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BusRepository busRepository;

    @Transactional
    public List<Seat> getSeatsByBusId(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));

        List<Seat> seats = seatRepository.findByBusId(busId);

        // Auto-generate seats based on bus totalSeats (numbered 1 to N) if not yet created
        if (seats.isEmpty()) {
            generateSeats(bus, seats);
        }
        return seats;
    }

    /**
     * Adjust seat set to match the bus's totalSeats value.
     * If the capacity increased, new seats are added.
     * If decreased, unbooked seats beyond the new limit are removed.
     * Throws IllegalStateException if decreasing would orphan already booked seats.
     */
    @Transactional
    public void adjustSeatsToBusCapacity(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));
        List<Seat> currentSeats = seatRepository.findByBusId(busId);
        int currentCount = currentSeats.size();
        int desired = bus.getTotalSeats() != null && bus.getTotalSeats() > 0 ? bus.getTotalSeats() : 40;
        if (desired == currentCount) {
            return; // nothing to do
        }
        if (desired > currentCount) {
            // add missing seats
            for (int i = currentCount + 1; i <= desired; i++) {
                Seat seat = new Seat();
                seat.setSeatNumber(String.valueOf(i));
                seat.setBooked(false);
                seat.setBus(bus);
                seatRepository.save(seat);
            }
        } else {
            // desired < currentCount – ensure we are not deleting booked seats
            List<Seat> removable = currentSeats.stream()
                    .filter(s -> !s.isBooked() && Integer.parseInt(s.getSeatNumber()) > desired)
                    .collect(Collectors.toList());
            // Verify that any seat beyond desired is not booked
            boolean anyBookedBeyond = currentSeats.stream()
                    .anyMatch(s -> s.isBooked() && Integer.parseInt(s.getSeatNumber()) > desired);
            if (anyBookedBeyond) {
                throw new IllegalStateException("Cannot reduce total seats: some booked seats exceed the new capacity.");
            }
            seatRepository.deleteAll(removable);
        }
    }

    private void generateSeats(Bus bus, List<Seat> seats) {
        int total = bus.getTotalSeats() != null && bus.getTotalSeats() > 0 ? bus.getTotalSeats() : 40;
        for (int i = 1; i <= total; i++) {
            Seat seat = new Seat();
            seat.setSeatNumber(String.valueOf(i));
            seat.setBooked(false);
            seat.setBus(bus);
            seats.add(seatRepository.save(seat));
        }
    }
}
