# High-Scale Energy Ingestion Engine

This project implements a backend ingestion and analytics service for a fleet
platform handling high-frequency telemetry from Smart Meters and EV Chargers.

The system is designed to handle **10,000+ devices**, ingesting data every
minute and supporting **~14.4 million records per day**, while still providing
fast analytical queries.

---

## Tech Stack

- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: TypeORM
- Containerization: Docker & Docker Compose

---

## High-Level Architecture

- **Ingestion Layer**
  - Accepts telemetry from Smart Meters (AC side)
  - Accepts telemetry from Vehicles/Chargers (DC side)
  - Single polymorphic ingestion endpoint

- **Storage Strategy**
  - Hot data (current state) → UPSERT
  - Cold data (historical telemetry) → INSERT only

- **Analytics Layer**
  - Time-bounded aggregation (last 24 hours)
  - Indexed queries only (no full table scans)

---

## How to Run the Project

### Prerequisites
- Docker Desktop installed and running

### Start Services
```bash
docker compose up --build
```

Backend:
http://localhost:3000

---

## API Endpoints

### Ingestion
POST /v1/ingestion

Vehicle Telemetry:
```json
{
  "vehicleId": "EV-101",
  "soc": 75,
  "kwhDeliveredDc": 10.5,
  "batteryTemp": 35,
  "timestamp": "2026-02-09T08:45:00Z"
}
```

Meter Telemetry:
```json
{
  "meterId": "MTR-101",
  "kwhConsumedAc": 12.8,
  "voltage": 228,
  "timestamp": "2026-02-09T08:45:00Z"
}
```

---

### Analytics
GET /v1/analytics/performance/:vehicleId

Example:
GET /v1/analytics/performance/EV-101

Response:
```json
{
  "totalAc": "14.8",
  "totalDc": "12.4",
  "efficiency": 0.83,
  "avgBatteryTemp": "36"
}
```

Efficiency = DC / AC

---

## Data Strategy

### Hot Tables
- current_vehicle_state
- current_meter_state

### Cold Tables
- vehicle_telemetry_history
- meter_telemetry_history

---

## Scaling Notes

- Append-only writes support high throughput
- Indexed analytics prevent full table scans
- Partitioning can be added for long-term growth

---

## Seed Data

Generate large telemetry volumes for testing:
```bash
docker exec -it energy_backend sh
npx ts-node src/scripts/seed-telemetry.ts
```

---

## Assumptions

- Vehicle-to-meter mapping exists
- Telemetry arrives every 60 seconds
