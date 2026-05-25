package com.busbooking;

import com.busbooking.entity.Bus;
import com.busbooking.entity.User;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.UserRepository;
import com.busbooking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatService seatService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed admin user
        if (!userRepository.existsByEmail("admin@bus.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@bus.com");
            admin.setPhone("0000000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Admin user seeded: admin@bus.com / admin123 <<<");
        }

        // Seed regular users
        if (!userRepository.existsByEmail("user@bus.com")) {
            User user1 = new User();
            user1.setName("User");
            user1.setEmail("user@bus.com");
            user1.setPhone("1111111111");
            user1.setPassword(passwordEncoder.encode("user123"));
            user1.setRole("ROLE_USER");
            userRepository.save(user1);
        }

        if (!userRepository.existsByEmail("jane@bus.com")) {
            User user2 = new User();
            user2.setName("Jane");
            user2.setEmail("jane@bus.com");
            user2.setPhone("2222222222");
            user2.setPassword(passwordEncoder.encode("jane123"));
            user2.setRole("ROLE_USER");
            userRepository.save(user2);
        }

        // Seed buses
        if (busRepository.count() == 0) {
            LocalDate today = LocalDate.now();
            LocalDate tomorrow = today.plusDays(1);

            List<Bus> seedBuses = Arrays.asList(
                    new Bus(null, "Orange Travels", "OR-7788", "Hyderabad", "Bangalore", today, "08:30 PM", "06:00 AM", 12, 12, 1200.00),
                    new Bus(null, "SRS Travels", "SR-1122", "Hyderabad", "Bangalore", tomorrow, "09:30 PM", "07:00 AM", 12, 12, 1500.00),
                    new Bus(null, "KPN Travels", "KP-4455", "Hyderabad", "Chennai", today, "07:00 PM", "05:30 AM", 12, 12, 950.00),
                    new Bus(null, "VRL Travels", "VR-9900", "Bangalore", "Pune", today, "06:00 PM", "04:30 AM", 12, 12, 1400.00),
                    new Bus(null, "Rajdhani Express", "RJ-3344", "Delhi", "Jaipur", today, "08:00 AM", "01:00 PM", 12, 12, 550.00),
                    new Bus(null, "Paulo Travels", "PA-5566", "Mumbai", "Goa", tomorrow, "10:00 PM", "08:30 AM", 12, 12, 1800.00)
            );

            for (Bus bus : seedBuses) {
                Bus savedBus = busRepository.save(bus);
                seatService.getSeatsByBusId(savedBus.getId());
            }
            System.out.println(">>> Database Seeded with 6 Bus routes and seat layouts initialized! <<<");
        }
    }
}
