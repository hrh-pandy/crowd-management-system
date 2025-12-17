A web-based Crowd Management & Analytics Dashboard built with Angular,
designed to monitor crowd metrics such as occupancy, footfall, dwell time,
and demographics across multiple sites. The application supports site-based filtering,
date-based analytics, and real-time data fetching via APIs.

📌 Features

📊 Dashboard Analytics

Live occupancy
Footfall trends
Average dwell time
Demographic insights

🏢 Multi-Site Support
Dynamic site selection from header dropdown
APIs triggered based on selected site and date range

🧭 Centralized Layout
Persistent sidebar and header across pages
Clean layout using Angular Router

🔁 Reactive Data Flow
Shared service to propagate selected site & date filters
Pages react automatically to filter changes

📄 Modular Page Structure
Dashboard
Crowd Entries
Analytics Setup
Login


⚙️ Prerequisites
Make sure the following are installed:
Node.js (v16+ recommended)
npm (comes with Node.js)
Angular CLI
Install Angular CLI globally if not installed: 
npm install -g @angular/cli

Setup Instructions
1️⃣ Clone the repository
git clone <repository-url>
cd crowd-management-system-full

2️⃣ Install dependencies
npm install

3️⃣ Run the application
ng serve

4️⃣ Open in browser
http://localhost:4200

Login Credentials
UserName: test@test.com
PassWord: 1234567890
