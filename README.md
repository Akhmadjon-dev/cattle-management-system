# Cattle Management System

A full-stack web application for managing cattle inventory and health records.

## Project Structure

- **server/** - Express.js backend with SQLite database
- **client/** - React + TypeScript frontend with Tailwind CSS
- **shared/** - Shared types and utilities

## Getting Started

### Backend Setup

```bash
cd server
npm install
npm run dev    # Start development server on http://localhost:3000
npm start      # Start production server
```

The backend API will be available at `http://localhost:3000/api`

### Frontend Setup

```bash
cd client
npm install
npm run dev    # Start development server on http://localhost:5173
npm run build  # Build for production
npm run preview # Preview production build
```

The frontend will be available at `http://localhost:5173`

## API

The client uses a thin fetch wrapper (`src/api.js`) with the following endpoints:

### Cattle
- `getCattle()` - List all cattle
- `getCattleById(id)` - Get cattle by ID
- `createCattle(data)` - Create new cattle
- `updateCattle(id, data)` - Update cattle
- `deleteCattle(id)` - Delete cattle

### Health Events
- `getHealthEvents(cattleId)` - List health events for cattle
- `createHealthEvent(cattleId, data)` - Record health event
- `updateHealthEvent(cattleId, eventId, data)` - Update event
- `deleteHealthEvent(cattleId, eventId)` - Delete event

### Analytics
- `getAnalytics()` - Get overall analytics
- `getHealthSummary()` - Get health summary
- `getBreedDistribution()` - Get breed distribution

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Tech Stack

### Backend
- Node.js
- Express 5.2.1
- SQLite (better-sqlite3)
- nodemon (dev)
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- PostCSS
