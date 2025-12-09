# Hotel Booking Platform

A full-stack RBAC-based Hotel Booking Platform.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Zustand, Recharts
- **Backend**: Node.js, Express, MongoDB, JWT
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (already created):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mytravaly
   JWT_SECRET=supersecretkey123
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- **Authentication**: Register/Login with Role-Based Access Control (Manager/Customer).
- **Manager Dashboard**: View analytics, create hotels, upload images.
- **Customer Dashboard**: View bookings, cancel bookings.
- **Hotel Booking**: Browse hotels, view details, book stays.

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/hotels`
- `POST /api/hotels` (Manager)
- `POST /api/bookings` (Customer)
- `GET /api/metrics/manager` (Manager)
