# 🍲 Mutam al Bukhari Restaurant - Full-Stack Web Application

Welcome to **Mutam al Bukhari**, a premium, modern, and fully functional **Full-Stack Web Application** designed for an authentic Arabian fine-dining restaurant. The application features a dynamic customer-facing frontend as well as a secure, session-authenticated Admin Dashboard to manage customer inquiries and messages in real time.

---

## 👨‍💻 Developer Information

* **Developer Name:** Saad Nadeem
* **Platform / Brand:** **Saad Dev Hub** 🚀
* **Role:** Full-Stack Web Developer
* **Mission:** Building clean, modern, high-performance, and user-centric web applications.

---

## ✨ Key Features

### 🌟 Customer Frontend
- 🍲 **Interactive Menu & Hero Section:** Showcasing authentic Arabian dishes with smooth scrolling and animations.
- 💬 **Contact & Inquiry Form:** Form validation with instant feedback using custom Toast notifications.
- ⭐ **Customer Reviews Slider:** Interactive testimonial carousel powered by Swiper.js.
- 📍 **Location & Google Map Embed:** Easy navigation for restaurant visitors.
- 📱 **Fully Responsive Layout:** Optimized across mobile, tablet, and desktop viewports.

### 🔐 Secure Admin Dashboard (`/admin`)
- 🔑 **Authentication & Security:** PBKDF2 password hashing with salt and cookie-based HTTP-only session management.
- 📩 **Message Management:** Read, filter, mark as read, or delete customer inquiries.
- 🔔 **Unread Message Counter:** Real-time indicator for pending customer queries.
- 🛠️ **Credential Management:** Option for admin to update username and password securely from within the dashboard.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 | Semantic markup & modern responsive styling (Glassmorphism & animations) |
| | JavaScript (ES6+) | Dynamic DOM manipulation, API fetching, and interactive features |
| | Swiper.js | Interactive review sliders |
| | FontAwesome 6 | Clean vector iconography |
| | Google Fonts | *Playfair Display* & *Poppins* typography |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web server framework & REST API endpoints |
| | Crypto (Node.js) | PBKDF2 password hashing & secure session token generation |
| **Database** | JSON Files | Lightweight persistent file storage (`data/messages.json`, `data/admin.json`) |

---

## 📁 Project Structure

```text
Mutam al Bukhari Restaurant/
├── data/
│   ├── admin.json          # Encrypted admin credentials storage
│   └── messages.json       # Customer messages database
├── public/
│   ├── css/
│   │   ├── style.css       # Main website stylesheet
│   │   ├── admin.css       # Admin dashboard stylesheet
│   │   └── toast.css       # Notification toast stylesheet
│   ├── js/
│   │   ├── main.js        # Frontend interactions & API submission
│   │   ├── admin.js       # Admin panel logic & message management
│   │   └── toast.js       # Toast notification system
│   ├── images/             # Food & background assets
│   ├── index.html          # Main customer website
│   └── admin.html          # Admin management dashboard
├── server.js               # Express server & API endpoints
├── package.json            # Node.js dependencies & scripts
└── README.md               # Project documentation
```

---

## 🔌 API Endpoints Summary

### 🌐 Public Endpoints
- `POST /api/contact` — Submit a new contact message/inquiry.

### 🔒 Admin Endpoints (Session Required)
- `POST /api/admin/login` — Authenticate admin user and issue session cookie.
- `POST /api/admin/logout` — Terminate active admin session.
- `GET  /api/admin/check` — Check current authentication state.
- `PUT  /api/admin/credentials` — Change admin username/password.
- `GET  /api/messages` — Fetch all submitted messages.
- `GET  /api/messages/unread-count` — Fetch count of unread messages.
- `PUT  /api/messages/:id/read` — Mark specific message as read.
- `DELETE /api/messages/:id` — Delete a specific message.

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have **Node.js** (v14 or higher) installed on your system.

### 📥 Installation
1. Clone or download the repository to your local machine.
2. Open terminal in the project root directory.
3. Install required dependencies:
   ```bash
   npm install
   ```

### 🏃 Running the Application
Start the server using Node.js:
```bash
npm start
```
or for development:
```bash
npm run dev
```

The application will start running at:
- 🌐 **Website:** `http://localhost:3000`
- 🔑 **Admin Panel:** `http://localhost:3000/admin`

---

## 🔑 Default Admin Credentials

Upon initial launch, default admin credentials are auto-generated:

* **Username:** `admin`
* **Password:** `admin@123`

> ⚠️ **Security Tip:** It is strongly recommended to update these credentials immediately after your first login via the Admin Dashboard.

---

## 📄 License & Credits

Designed & Developed with ❤️ by **Saad Nadeem** (**Saad Dev Hub**).  
All rights reserved.
