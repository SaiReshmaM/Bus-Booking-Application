package com.busbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

/**
 * Simple email service for sending booking and cancellation notifications.
 * Configure SMTP settings in application.properties.
 */
@Service
public class EmailService {

    @Value("${spring.mail.from}")
    private String fromAddress;

    @Autowired
    private JavaMailSender emailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        // The "from" address can be configured via spring.mail.username property.
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendBookingConfirmation(String toEmail, String bookingDetails) {
        String subject = "Bus Booking Confirmation";
        String text = "Your booking has been confirmed!\n\nDetails:\n" + bookingDetails;
        try {
            sendEmail(toEmail, subject, text);
        } catch (Exception e) {
            // Log the exception (could use a logger) but avoid throwing to keep transaction stable
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
    }

    public void sendBookingCancellation(String toEmail, String bookingDetails) {
        String subject = "Bus Booking Cancelled";
        String text = "Your booking has been cancelled.\n\nDetails:\n" + bookingDetails;
        try {
            sendEmail(toEmail, subject, text);
        } catch (Exception e) {
            System.err.println("Failed to send booking cancellation email: " + e.getMessage());
        }
    }

    public void sendBusCancellation(String toEmail, String busDetails) {
        String subject = "Bus Service Cancelled";
        String text = "We regret to inform you that the bus you booked has been cancelled.\n\nBus Details:\n" + busDetails;
        try {
            sendEmail(toEmail, subject, text);
        } catch (Exception e) {
            System.err.println("Failed to send bus cancellation email: " + e.getMessage());
        }
    }
}
