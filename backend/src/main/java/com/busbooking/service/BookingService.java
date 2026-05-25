package com.busbooking.service;

import com.busbooking.dto.BookingRequest;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.exception.SeatAlreadyBookedException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.busbooking.service.EmailService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SeatService seatService;

    @Transactional
    public Booking bookTicket(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + request.getBusId()));

        // Make sure seats are initialized (using seatService's auto-generation if needed)
        seatService.getSeatsByBusId(bus.getId());

        List<Seat> seatsToBook = new ArrayList<>();
        
        // Validate each seat
        for (String seatNum : request.getSeatNumbers()) {
            Seat seat = seatRepository.findByBusIdAndSeatNumber(bus.getId(), seatNum)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + seatNum + " not found on this bus"));
            
            if (seat.isBooked()) {
                throw new SeatAlreadyBookedException("Seat " + seatNum + " is already booked. Please choose another seat.");
            }
            seatsToBook.add(seat);
        }

        // Mark seats as booked
        for (Seat seat : seatsToBook) {
            seat.setBooked(true);
            seatRepository.save(seat);
        }

        // Update bus available seats count
        int seatsCount = request.getSeatNumbers().size();
        bus.setAvailableSeats(Math.max(0, bus.getAvailableSeats() - seatsCount));
        busRepository.save(bus);

        // Calculate pricing
        double totalAmount = bus.getFare() * seatsCount;
        String commaSeparatedSeats = String.join(",", request.getSeatNumbers());

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBus(bus);
        booking.setSeatNumbers(commaSeparatedSeats);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");

        Booking saved = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(user.getEmail(),
                "Booking ID: " + saved.getId() + ", Bus: " + bus.getBusName() + ", Seats: " + commaSeparatedSeats + ", Date: " + bus.getTravelDate());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUserId(Long userId) {
        // Ensure user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        // Update status
        booking.setStatus("CANCELLED");

        // Free the booked seats
        Bus bus = booking.getBus();
        String[] seatNums = booking.getSeatNumbers().split(",");
        for (String seatNum : seatNums) {
            seatRepository.findByBusIdAndSeatNumber(bus.getId(), seatNum.trim())
                    .ifPresent(seat -> {
                        seat.setBooked(false);
                        seatRepository.save(seat);
                    });
        }

        // Restore bus available seats count
        bus.setAvailableSeats(Math.min(bus.getTotalSeats(), bus.getAvailableSeats() + seatNums.length));
        busRepository.save(bus);

        Booking saved = bookingRepository.save(booking);
        String userEmail = booking.getUser().getEmail();
        emailService.sendBookingCancellation(userEmail,
                "Booking ID: " + saved.getId() + ", Bus: " + bus.getBusName() + ", Seats: " + booking.getSeatNumbers() + ", Date: " + bus.getTravelDate());
        return saved;
    }
}
