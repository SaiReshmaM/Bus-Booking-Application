package com.busbooking.service;

import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatService seatService;

    @Transactional
    public Bus addBus(Bus bus) {
        bus.setAvailableSeats(bus.getTotalSeats());
        Bus savedBus = busRepository.save(bus);
        // Auto-generate 12 seats (A1-A4, B1-B4, C1-C4)
        seatService.getSeatsByBusId(savedBus.getId());
        return savedBus;
    }

    @Transactional
    public Bus updateBus(Long id, Bus updatedBus) {
        Bus existing = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));

        existing.setBusName(updatedBus.getBusName());
        existing.setBusNumber(updatedBus.getBusNumber());
        existing.setSource(updatedBus.getSource());
        existing.setDestination(updatedBus.getDestination());
        existing.setTravelDate(updatedBus.getTravelDate());
        existing.setDepartureTime(updatedBus.getDepartureTime());
        existing.setArrivalTime(updatedBus.getArrivalTime());
        existing.setFare(updatedBus.getFare());
        // Update mutable total seats
        existing.setTotalSeats(updatedBus.getTotalSeats());
        // Adjust seat records to match new capacity
        seatService.adjustSeatsToBusCapacity(id);
        return busRepository.save(existing);
    }

    @Transactional
    public void deleteBus(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
        // Delete related seats
        List<Seat> seats = seatRepository.findByBusId(id);
        seatRepository.deleteAll(seats);
        // Delete related bookings
        List<Booking> bookings = bookingRepository.findAll();
        bookings.stream()
                .filter(b -> b.getBus().getId().equals(id))
                .forEach(bookingRepository::delete);
        busRepository.delete(bus);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
}
