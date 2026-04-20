---
marp: true
theme: default
paginate: true
backgroundColor: #1a1a2e
color: white
---

# Smart Parking Availability System
## IoT-Based Final Project
**Garvin Patel** | NKU | Spring 2026

---

# The Problem

Students waste time driving through parking garages
searching for open spots with **no real-time visibility**

- No system to check availability before entering
- Results in wasted time and traffic congestion
- Students arriving late to class daily

---

# The Solution

A real IoT system that **physically detects** cars
and displays live availability on any device

---

# Hardware Setup

- **HC-SR04** — ultrasonic sensor detects cars
- **XIAO ESP32C6** — reads sensor + sends WiFi data
- **Logic Level Converter** — protects ESP32 from 5V
- **Breadboard** — connects all components

---

# How Detection Works

---

# Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Hardware | HC-SR04 + ESP32C6 | Built-in WiFi, no extra module |
| Firmware | C++ Arduino IDE | Direct hardware control |
| Backend | Python Flask | Beginner friendly, professor recommended |
| Database | MongoDB Atlas | Flexible JSON, cloud hosted |
| Frontend | React.js | Live updates without page refresh |

---

# Backend — Flask API

```python
@app.route('/update', methods=['POST'])
def update_spot():
    data = request.get_json()
    distance = data.get('distance_cm', 0)
    status = "OCCUPIED" if distance < 50 else "AVAILABLE"
    spots_collection.update_one(
        {"spot_id": spot_id},
        {"$set": {"status": status}},
        upsert=True
    )
    return jsonify({"status": status})
```

---

# Database — MongoDB Atlas

Collections:
- **spots** — current status of each spot
- **readings** — full history with timestamps

```json
{
  "spot_id": "A1",
  "status": "OCCUPIED",
  "distance_cm": 12.3,
  "last_updated": "21:15:50"
}
```

---

# Live Dashboard — React

- 120 parking spots across 6 rows
- Animated cars in occupied spots
- Green circles for available spots
- Auto-refreshes every 3 seconds
- Filter by Available / Occupied

---

# Sprint 1 — What I Built

- Wired HC-SR04 to Arduino Nano ✅
- Identified voltage issue (5V vs 3.3V) ✅
- Added logic level converter ✅
- Rewired to ESP32C6 ✅
- Live distance readings in Serial Monitor ✅
- Basic WiFi dashboard working ✅

---

# Sprint 2 — What I Built

- Flask REST API receiving sensor data ✅
- MongoDB Atlas storing all readings ✅
- React dashboard with 120 animated spots ✅
- Full pipeline: Sensor → API → DB → Dashboard ✅

---

# Hardest Problems Solved

1. **5V vs 3.3V** — would have damaged ESP32, fixed with level converter
2. **CH340 Driver** — Mac doesn't support natively, installed manually
3. **WiFi Connection** — different network IPs blocked communication
4. **MongoDB SSL** — certificate error fixed with tlsAllowInvalidCertificates
5. **HTTP vs HTTPS** — Chrome redirects broke ESP32 web server

---

# Learning With AI — Topic 1
## Embedded C++ Sensor Programming

- pulseIn() timing formula for distance calculation
- INPUT vs OUTPUT pin behavior (critical for voltage safety)
- Serial Monitor debugging at 115200 baud
- Logic level converter wiring to protect ESP32

---

# Learning With AI — Topic 2
## IoT Networking — ESP32 to Cloud Pipeline

- WiFi.begin() and HTTPClient for POST requests
- Flask routes and MongoDB upsert operations
- React useEffect with setInterval for live polling
- Debugging WiFi status codes and SSL errors

---

# Live Demo

**System Architecture:**

**Demo:** Put hand in front of sensor →
Dashboard updates from AVAILABLE to OCCUPIED in 3 seconds

---

# Thank You

**Garvin Patel** 

GitHub: [your repo link]
Demo Video: [your video link]
