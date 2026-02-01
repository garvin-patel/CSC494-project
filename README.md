# CSC494-project
CSC 494 Individual Project

# Smart Parking Availability System

## Project Overview

The Smart Parking Availability System is an IoT-based project designed to help students determine parking availability in a parking garage before entering. The system aims to reduce time wasted searching for parking spots, minimize congestion, and improve the overall parking experience.

---

## Problem Statement

Students using parking garages often drive through multiple levels trying to find an empty parking spot. There is currently no easy way to know whether the garage has available spaces in advance. This results in frustration, wasted time, and increased traffic inside the garage.

---

## Proposed Solution

This project proposes an IoT-based system that collects sensor data and transmits it wirelessly to a backend service. The backend processes the data and provides a real-time parking availability status that users can access through a web-based interface.

---

## IoT Hardware Used

This project uses the provided IoT project skeleton:

- **Arduino Nano** – main controller
- **ESP32-C6** – WiFi/BLE communication
- **TMP102 I2C Temperature Sensor** – representative sensor for data collection

The temperature sensor is used to simulate parking-related data for system design and communication flow.

---

## Technologies (Planned)

### Hardware
- Arduino Nano
- ESP32-C6
- TMP102 Temperature Sensor

### Software
- Arduino C/C++
- Node.js with Express
- MongoDB
- React

---

## Project Structure

CSC494-project
├── src/ # Source code files
├── docs/ # Project documentation
│ ├── PPP.md # Project Plan Presentation
│ └── README.md # Documentation index


---

## Project Plan Presentation (PPP)

The Project Plan Presentation (PPP) document contains detailed information about the project plan, architecture, milestones, risks, and progress tracking.

📄 **PPP Document:**  
`docs/PPP.md`

---

## Status

The project is currently in the planning and design phase. Implementation will begin after PPP review and approval.

---

## Course Information

- Course: CSC 494
- Project Type: Individual Project
- Focus: IoT-based software engineering project
