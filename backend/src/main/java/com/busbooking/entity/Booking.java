package com.busbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(nullable = false)
    private String seatNumbers; // comma-separated seats, e.g., "A1,A2"

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String status; // CONFIRMED or CANCELLED

    public Booking() {
    }

    public Booking(Long id, User user, Bus bus, String seatNumbers, LocalDateTime bookingDate, Double totalAmount, String status) {
        this.id = id;
        this.user = user;
        this.bus = bus;
        this.seatNumbers = seatNumbers;
        this.bookingDate = bookingDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
