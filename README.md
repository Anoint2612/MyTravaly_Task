# LuxeStay - Premium Hotel Management Dashboard

A high-fidelity, UI/UX-centric Hotel Management Dashboard built with modern web technologies. This project prioritizes visual aesthetics, smooth interactions, and immersive user experiences.

## 🎨 UI/UX Highlights

This project was crafted with a "Design First" philosophy, featuring:

- **Immersive Loading Experiences**:
  - **Video-based Loaders**: Context-aware video animations (e.g., "Delivery Schedule" for bookings, "Revenue" for stats) provide a premium feel during tab transitions.
  - **Custom CSS Animations**: Bespoke CSS loaders like the "Jumping Square" for filters and "Grid Pulse" for metrics ensure users are always entertained, even while waiting.
- **Interactive Data Visualization**:
  - **3D Pie Charts**: Integrated **AmCharts** for stunning 3D visualizations of revenue data.
  - **Dynamic Bar Charts**: **Recharts** implementation with custom tooltips and smooth transitions.
  - **Seamless Toggles**: Linear loading indicators provide visual feedback when switching between chart types.
- **Glassmorphism & Modern Aesthetics**:
  - **Blooming Cards**: Metrics cards feature a unique "blooming" entry animation, glass-morphic backgrounds, and subtle glow effects on hover.
  - **Polished Components**: Custom-styled dropdowns, badges, and buttons that adhere to a cohesive design system.
- **Micro-Interactions**:
  - Hover states with scale and glow effects.
  - Smooth transitions for filtering and sorting operations.
  - Animated entry for page content (`animate-slide-up`, `animate-fade-in`).

## 🛠️ Tech Stack

### Frontend Core
- **React.js (Vite)**: For lightning-fast development and performance.
- **TypeScript**: Ensuring type safety and code robustness.
- **Tailwind CSS**: For rapid, utility-first styling and custom design systems.

### UI & Animation Libraries
- **AmCharts 4**: For high-end 3D charting capabilities.
- **Recharts**: For responsive and customizable standard charts.
- **Lucide React**: For clean, consistent iconography.
- **Sonner**: For beautiful, non-intrusive toast notifications.
- **Custom CSS**: Hand-crafted keyframe animations for unique loaders and effects.

### State Management & Data
- **Zustand**: For lightweight and efficient global state management.
- **Axios**: For robust API integration.

## ✨ Key Features

### Manager Dashboard
- **Comprehensive Metrics**: Real-time view of Total Bookings, Revenue, Occupancy, and more, displayed in interactive cards.
- **Advanced Filtering**:
  - **Time-Travel**: Filter metrics by various ranges (Last 7 days to Last 12 months).
  - **Granular Booking Control**: Filter bookings by Payment Status, Room Type, and Order.
- **Visual Analytics**: Toggle between 3D Pie Charts and Bar Charts to analyze revenue trends.
- **Property Management**: Add, edit, and delete hotel listings with a seamless modal interface.

## 🚀 Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Frontend Setup (The Star of the Show)
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
   *The app will launch at `http://localhost:8080` (or next available port).*

### Backend Setup
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mytravaly
   JWT_SECRET=supersecretkey123
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## 📸 Visual Showcase

*Note: The application features video backgrounds and animations that are best experienced live.*

