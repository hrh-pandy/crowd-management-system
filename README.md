# 🎯 Crowd Management & Analytics Dashboard

A web-based **Crowd Management & Analytics Dashboard** built with **Angular**, designed to monitor crowd metrics such as occupancy, footfall, dwell time, and demographics across multiple sites. The application supports site-based filtering, date-based analytics, and real-time data fetching via APIs.

---

## 📌 Features 

### 📊 Dashboard Analytics
- ✅ Live occupancy tracking
- ✅ Footfall trends visualization
- ✅ Average dwell time monitoring
- ✅ Demographic insights (Gender distribution)

### 🏢 Multi-Site Support
- 🔄 Dynamic site selection from header dropdown
- 🔗 APIs triggered based on selected site and date range
- 📍 Real-time site switching

### 🧭 Centralized Layout
- 🎨 Persistent sidebar and header across pages
- 🚀 Clean layout using Angular Router
- 📱 Responsive design

### 🔁 Reactive Data Flow
- 🔄 Shared service to propagate selected site & date filters
- ⚡ Pages react automatically to filter changes
- 🎯 Context-aware API calls

### 📄 Modular Page Structure
- 🏠 **Dashboard** - Overview with KPIs and charts
- 👥 **Crowd Entries** - Detailed entry/exit records with pagination
- 🔐 **Login** - Secure authentication page

---

## ⚙️ Prerequisites

Make sure the following are installed:

- **Node.js** (v16+ recommended) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Angular CLI**

### Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd crowd-management-system-full
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the application
```bash
ng serve
```

### 4️⃣ Open in browser

Navigate to:
```
http://localhost:4200
```

---

## 🔐 Login Credentials

Use the following credentials to access the dashboard:

| Field    | Value              |
|----------|--------------------|
| Username | `test@test.com`    |
| Password | `1234567890`       |

---



## 🛠️ Technologies Used

| Technology      | Purpose                          |
|-----------------|----------------------------------|
| **Angular 16+** | Frontend framework              |
| **TypeScript**  | Type-safe JavaScript            |
| **Chart.js**    | Data visualization              |
| **RxJS**        | Reactive programming            |
| **CSS3**        | Styling and responsive design   |

---

## 📊 Key Features Breakdown

### Dashboard Page
- 📈 Real-time occupancy timeline chart
- 👥 Demographics donut chart (Male/Female distribution)
- 📊 Footfall by hour bar chart
- 🔢 KPI cards (Live Occupancy, Footfall, Dwell Time)

### Crowd Entries Page
- 📋 Paginated table of entry/exit records
- ⏱️ Dwell time calculation
- 🔄 Automatic data refresh on site change
- ⚡ Loading indicators for better UX

---
