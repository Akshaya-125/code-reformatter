# AI Code Reformatter

An AI-powered full-stack web application that reformats code using Google Gemini AI.
Paste any code, choose a mode, and get a cleaner version instantly.

## Live Demo
> Coming soon — deploying on AWS

## Features
- 4 AI modes — Shorten, Minify, Clean up, Add comments
- Supports 8 languages — Python, JavaScript, TypeScript, Java, C++, Go, Rust, SQL
- Real-time reduction stats (e.g. ↓ 42% shorter)
- Full microservices architecture
- JWT user authentication
- Reformat history saved to database

## System Architecture
Browser → Angular (4200) → Spring Boot (8081) → Django (8000) → Gemini AI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22, TypeScript, SCSS |
| API Gateway | Spring Boot 3, Java 17, JWT Auth |
| AI Service | Django 6, Python 3.13, Gemini AI |
| Database | PostgreSQL (H2 for dev) |
| DevOps | Git, Maven, Jenkins, Ansible |
| Cloud | AWS EC2, RDS |

## Project Structure
ai-code-reformatter/ ← Angular frontend
demo/ ← Spring Boot API gateway
django-ai-service/ ← Django AI microservice

## Local Setup

### 1. Angular Frontend
```bash
cd ai-code-reformatter
npm install
ng serve
# Runs at http://localhost:4200
```

### 2. Django AI Service
```bash
cd django-ai-service
pip install -r requirements.txt
# Create .env file with your GEMINI_API_KEY
python manage.py runserver 8000
# Runs at http://localhost:8000
```

### 3. Spring Boot Backend
```bash
cd demo
mvnw.cmd spring-boot:run
# Runs at http://localhost:8081
```

## API Endpoints

### Spring Boot (port 8081)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |
| POST | /api/reformat | Reformat code via AI |
| GET | /api/history | Get user reformat history |
| GET | /api/health | Health check |

### Django (port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reformat/ | Call Gemini AI |
| GET | /api/health/ | Health check |

## Environment Variables
Create `django-ai-service/.env`:
GEMINI_API_KEY=your_gemini_api_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

## Author
**Akshaya** — [GitHub](https://github.com/Akshaya-125)