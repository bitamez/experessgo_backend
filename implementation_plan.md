# Bus Booking System Implementation Plan

This document outlines the architecture and implementation steps for a premium Bus Booking System featuring AI integration, multi-language support (English/Amharic), and secure payments.

## 1. Architecture Overview

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + Framer Motion (for animations).
- **Backend**: Django (REST Framework) for complex business logic, AI integration, and third-party payment processing (Chapa, Telebirr, CBE).
- **Database/Auth**: Supabase (PostgreSQL) for row-level security (RLS), real-time updates, and authentication.
- **AI Integration**: OpenAI/Anthropic (via Django backend) for the chatbot and recommendation logic.

## 2. Database Schema (Supabase SQL)

The core SQL for Supabase was provided by the user. I'll summarize the structure here for reference.

### Core Tables
- `users`: Extends Supabase auth. Includes rewards and language preferences.
- `buses`: List of available buses and their capacity.
- `seats`: Dynamic seat management for each bus.
- `routes`: Source and destination in English and Amharic.
- `schedules`: Links buses, routes, dates, and times.
- `bookings`: Records of user reservations.
- `payments`: Integration logs for Chapa, Telebirr, and CBE.

### Logic & Security
- `handle_rewards()` function and trigger for automatic bonus ticket generation.
- Row Level Security (RLS) policies for user data isolation.

## 3. Implementation Steps

### Phase 1: Environment Setup
- [ ] Initialize `frontend` (React + Tailwind).
- [ ] Initialize `backend` (Django + DRF).
- [ ] Configure Supabase environment variables.

### Phase 2: Database & Auth
- [ ] Execute SQL schema in Supabase.
- [ ] Setup Supabase Auth in the React app.

### Phase 3: Frontend Development (Premium UI)
- [ ] **Design System**: Glassmorphism, deep dark mode, gold/neon accents.
- [ ] **Components**: 
  - Nav bar with language switcher.
  - Bus Search section.
  - Interactive Seat Map.
  - Booking Summary & Payment Modal.
  - AI Chatbot Widget.
  - Dashboard (Rewards & Travel History).
- [ ] **Animations**: Smooth transitions using Framer Motion.

### Phase 4: Backend Logic (Django)
- [ ] Create API for fetching schedules and seats.
- [ ] Integrate Chapa API (and placeholders for Telebirr/CBE).
- [ ] Implement AI Chatbot endpoint (OpenAI integration).
- [ ] Implement Simple Recommendation logic based on previous user routes.

### Phase 5: AI & Polish
- [ ] Enhance Chatbot with bus-specific knowledge (schedules, prices).
- [ ] Final UI/UX audit for "WOW" factor.

## 4. Visual Inspiration & Design
We will use a **Luxurious Dark Mode** style as seen in the mockup:
- Background: Very dark navy/charcoal (`#0a0a0c`).
- Cards: Semi-transparent glassmorphism with subtle gold borders.
- Primary Color: Golden Amber interaction points.
- Typography: Outfit or Inter (modern sans-serif).
