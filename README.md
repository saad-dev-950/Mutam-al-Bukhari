# 🍲 Mutam al Bukhari Restaurant - Full-Stack Web Application

🌐 **Live Preview:** [https://mutam-al-bukhari.netlify.app/](https://mutam-al-bukhari.netlify.app/)

Welcome to **Mutam al Bukhari**, a premium, modern, and fully functional **Full-Stack Web Application** designed for an authentic Arabian fine-dining restaurant. The application features an interactive customer-facing frontend powered by a robust Express.js backend.

---

## 👨‍💻 Developer Information

* **Developer Name:** Saad Nadeem
* **Platform / Brand:** **Saad Dev Hub** 🚀
* **Role:** Full-Stack Web Developer
* **Mission:** Building clean, modern, high-performance, and user-centric web applications.

---

## ✨ Key Features

- 🍲 **Interactive Menu & Hero Section:** Showcasing authentic Arabian dishes with smooth scrolling and elegant layout.
- 💬 **Contact & Inquiry Form:** Form validation with real-time backend processing and custom Toast notifications.
- ⭐ **Customer Reviews Slider:** Interactive testimonial carousel powered by Swiper.js.
- 📍 **Location & Google Map Embed:** Easy navigation and contact details for restaurant visitors.
- 📱 **Fully Responsive Layout:** Optimized across mobile, tablet, and desktop viewports.

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
| **Database** | JSON Files | Lightweight persistent file storage (`data/messages.json`) |

---

## 📁 Project Structure

```text
Mutam al Bukhari Restaurant/
├── data/
│   └── messages.json       # Customer messages database
├── public/
│   ├── css/
│   │   ├── style.css       # Main website stylesheet
│   │   └── toast.css       # Notification toast stylesheet
│   ├── js/
│   │   ├── main.js        # Frontend interactions & API submission
│   │   └── toast.js       # Toast notification system
│   ├── images/             # Food & background assets
│   └── index.html          # Main customer website
├── server.js               # Express server & API endpoints
├── package.json            # Node.js dependencies & scripts
└── README.md               # Project documentation
```

---

## 🔌 API Endpoints

- `POST /api/contact` — Submit a new contact message/inquiry.

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
or for development mode:
```bash
npm run dev
```

The application will start running at:
- 🌐 **Website:** `http://localhost:3000`

---

## 📄 License & Credits

Designed & Developed with ❤️ by **Saad Nadeem** (**Saad Dev Hub**).  
All rights reserved.
