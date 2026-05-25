package com.busbooking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookingRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seatNumbers;

    public BookingRequest() {
    }

    public BookingRequest(Long userId, Long busId, List<String> seatNumbers) {
        this.userId = userId;
        this.busId = busId;
        this.seatNumbers = seatNumbers;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
