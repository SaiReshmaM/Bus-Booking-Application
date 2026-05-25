package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndTravelDate(String source, String destination, LocalDate travelDate);
}
