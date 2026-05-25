# 🚌 Bus Booking Application

A full-stack **Online Bus Booking System** built using **Java Spring Boot**, **React.js**, and **H2 Database**.

This project allows customers to search buses, check seat availability, book tickets, cancel bookings, and receive confirmation emails.  
Administrators can manage buses, routes, and booking reports through a dedicated dashboard.

GitHub Repository: :contentReference[oaicite:0]{index=0}

---

## 📌 Project Overview

The Bus Booking Application is a web-based reservation platform designed to simplify ticket booking.

The system supports:

### Customer

- Register / Login
- Search buses by route
- View available seats
- View booked seats
- Select seats
- Book tickets
- Receive booking confirmation email
- View booking history
- Cancel bookings
- Receive cancellation email

### Administrator

- Add buses
- Edit routes
- Delete buses
- View booking reports
- Track bookings and revenue

The project uses **JWT authentication** and role-based access.

---

# 🛠 Tech Stack

## Frontend

- React.js
- JavaScript
- Axios
- React Router DOM
- Bootstrap / CSS

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Maven
- JWT Authentication

## Database

- H2 Database

## Email Service

- EmailJS

Sender email:

`jnslsakuntala_sighakolli@srmap.edu.in`

---

# 📂 Project Structure

```bash
Bus-Booking-Application
│
├── backend
│   ├── src/main/java/com/busbooking
│   │   ├── config
│   │   ├── controller
│   │   ├── dto
│   │   ├── entity
│   │   ├── exception
│   │   ├── repository
│   │   ├── security
│   │   └── service
│   │
│   └── src/main/resources
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       └── services
│
└── README.md
```

---

# ✨ Features

## Authentication

- User registration
- Login
- JWT token generation
- Password encryption using BCrypt
- Role-based authorization

Roles:

- CUSTOMER
- ADMINISTRATOR

---

## Customer Features

### Search buses

Search by:

- Source
- Destination

---

### Seat selection

- View real-time seats
- Booked seats shown as unavailable
- Prevent double booking
- Select multiple seats

---

### Booking

- Book seats
- Store booking history
- View booking details

---

### Cancellation

- Cancel booking
- Seat becomes available again

---

### Email Notifications

Customer receives:

- Registration confirmation
- Booking confirmation
- Booking cancellation

---

## Admin Features

### Add bus

Fields:

- Bus name
- Bus number
- Source
- Destination
- Travel date
- Departure time
- Arrival time
- Total seats
- Fare

---

### Manage buses

- Update routes
- Edit fare
- Delete buses

---

### Reports

View:

- Booking ID
- Customer name
- Route
- Travel date
- Seats booked
- Fare
- Booking status

Dashboard cards:

- Total buses
- Total bookings
- Revenue

---

# 🔐 Security

Spring Security configuration includes:

- JWT authentication filter
- Stateless session
- BCrypt password encryption
- CORS configuration
- Role-based API protection

Protected routes:

```text
/api/admin/**       -> ADMIN only
/api/bookings/**    -> authenticated users
/api/auth/**        -> public
/api/buses/**       -> public
/api/seats/**       -> public
```

---

# 🗄 Database Schema

## User

- id
- name
- email
- phone
- password
- role

---

## Bus

- id
- busName
- busNumber
- source
- destination
- travelDate
- departureTime
- arrivalTime
- totalSeats
- fare

---

## Seat

- id
- seatNumber
- booked
- busId

---

## Booking

- id
- userId
- busId
- seatNumbers
- amount
- status

---

# 🚀 Installation

## Clone repository

```bash
git clone https://github.com/SaiReshmaM/Bus-Booking-Application.git
```

---

## Backend setup

Go to backend:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

---

## Frontend setup

Go to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Run:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 📮 REST API

## Auth

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Bus

```http
GET /api/buses/search
GET /api/seats/{busId}
```

---

## Booking

```http
POST /api/bookings
GET /api/bookings/user/{userId}
PUT /api/bookings/cancel/{bookingId}
```

---

## Admin

```http
POST /api/admin/buses
PUT /api/admin/buses/{id}
DELETE /api/admin/buses/{id}
GET /api/admin/reports
```

---

# 🧪 Testing

Project tested using:

- Browser UI
- Postman
- PowerShell API scripts

Includes:

- Register
- Login
- Search
- Booking
- Cancellation
- Admin operations

---

# 👩‍💻 Contributors

Developed as a Java Full Stack project.

Team:

- Vinaya
- Sai Reshma

---

# 📷 Future Enhancements

Possible improvements:

- Online payment integration
- PDF ticket download
- Live bus tracking
- User profile page
- Search filters
- Mobile responsive UI improvements

---

# ✅ Conclusion

This project demonstrates a complete Java full-stack workflow:

- Frontend UI with React
- REST APIs with Spring Boot
- Authentication using JWT
- Database with H2
- Role-based authorization
- Real-time booking flow
- Email notifications

It provides a practical reservation system with customer and admin functionality.
