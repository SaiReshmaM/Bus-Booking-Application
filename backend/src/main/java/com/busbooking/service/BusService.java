package com.busbooking.service;

import com.busbooking.entity.Bus;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Transactional(readOnly = true)
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Bus> searchBuses(String source, String destination, LocalDate travelDate) {
        return busRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndTravelDate(source, destination, travelDate);
    }

    @Transactional(readOnly = true)
    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
    }
}
