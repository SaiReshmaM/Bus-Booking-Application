package com.busbooking.service;

import com.busbooking.dto.AuthResponse;
import com.busbooking.dto.LoginRequest;
import com.busbooking.dto.RegisterRequest;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.UserRepository;
import com.busbooking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());
        emailService.sendWelcomeEmail(savedUser);

        return new AuthResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getPhone(), token, savedUser.getRole());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email and password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(), token, user.getRole());
    }
}
