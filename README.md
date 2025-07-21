# Fullstack Emotion Detector

🚀 Full stack web app that detects emotions from user-input text using Hugging Face API.

---

## Backend - Spring Boot Service (Phase 1 Completed)

### 📦 Tech Stack Backend
- Java 17, Spring Boot
- PostgreSQL 16 database
- Docker & Docker Compose
- JWT-based security

---

## 🛠️ Getting Started (Backend)

### Prerequisites
- Docker and Docker Compose installed
- Ports 8080 (backend) and 5432 (PostgreSQL) free

---

### Run backend and database locally with Docker Compose

1. Clone the repo (if not already done)

```bash
git clone https://github.com/your-username/analyzai-app.git
cd analyzai-app/backend
~~~~~~~~
```
2. Build and start containers

```bash
docker compose up --build

```
3. Wait for containers to be fully up

Backend will be available at: http://localhost:8080
PostgreSQL database at: localhost:5432