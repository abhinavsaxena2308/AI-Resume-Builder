# 🧠 Resume Builder (AI-Powered with Google Generative Language API)

[![Built with React](https://img.shields.io/badge/Built%20With-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Cloud](https://img.shields.io/badge/API-Google%20Generative%20AI-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](#)

---

## 🌟 Overview

**Resume Builder** is a next-gen **AI-powered resume generator** that crafts professional summaries using the **Google Generative Language API**.  
Designed with a clean, modern interface, it features **dark mode**, **responsive design**, and **real-time AI assistance** — built entirely with **React + Vite + TailwindCSS + Express**.

---

## ⚡ Features

- 🧠 **AI-Powered Summary Generator** (Google Text-Bison Model)
- 🎨 **Beautiful UI** built with TailwindCSS
- 🌗 **Dark & Light Theme Toggle**
- 🧾 **JSON-based Backend Integration** (Express.js)
- 🔒 **Secure Environment Variables** for API keys
- ⚙️ **Lightning Fast Development** using Vite
- 💾 **Theme Persistence** using LocalStorage

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite) |
| **Styling** | TailwindCSS + Custom Variables |
| **Backend** | Node.js + Express |
| **AI Integration** | Google Generative Language API (Text Bison) |
| **Icons** | Lucide React |
| **Storage** | LocalStorage (theme persistence) |

---

## 📂 Folder Structure

```
resume-builder/
│
├── src/
│   ├── components/
│   │   └── ThemeToggle.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── resume-backend/
│   └── index.js
│
├── .env
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/resume-builder.git
cd resume-builder
```

---

### 2️⃣ Backend Setup

```bash
cd resume-backend
npm install express cors node-fetch dotenv
```

Create a `.env` file in `resume-backend` directory:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

Run the backend:
```bash
node index.js
```
✅ Backend will start at `http://localhost:3000`

---

### 3️⃣ Frontend Setup

```bash
cd ../
npm install
npm install lucide-react
npm run dev
```

🌐 Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoint

### POST `/generate-summary`

**Request Body:**
```json
{
  "name": "John Doe",
  "experience": [
    { "title": "Software Engineer", "company": "TechCorp", "description": "Developed scalable web apps." }
  ],
  "skills": ["React", "Node.js", "JavaScript"]
}
```

**Response:**
```json
{
  "summary": "John Doe is a skilled software engineer experienced in building modern web applications using React and Node.js."
}
```

---

## 🌗 Dark Mode

🌓 Toggle between **light** and **dark** themes with a smooth transition.  
Your preference is automatically saved in local storage for the next visit.

---

## 🧩 Environment Variables

| Variable | Description |
|-----------|-------------|
| `GOOGLE_API_KEY` | Your Google Generative Language API key |

> ⚠️ Keep `.env` private — **never commit it to GitHub**.

---

## 🧠 How It Works

1. User inputs data → name, experience, and skills  
2. Frontend sends a request to Express backend  
3. Backend calls Google’s Generative Language API (`text-bison-001`)  
4. API returns a personalized, professional resume summary  
5. Frontend displays the AI-generated output beautifully

---

## 📸 Screenshots

| 🕶️ Light Mode | 🌙 Dark Mode |
|----------------|--------------|
| ![Light Mode](assets/light.png) | ![Dark Mode](assets/dark.png) |

---

## 💬 Postman Testing

- **Endpoint:** `http://localhost:3000/generate-summary`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Abhinav",
    "skills": ["Leadership", "Communication", "Problem Solving"],
    "experience": [
      { "title": "NCC Cadet", "company": "Indian NCC", "description": "Represented state and saluted the PM at RDC." }
    ]
  }
  ```

✅ You’ll get a response like:
```json
{
  "summary": "Abhinav is a dedicated NCC cadet with exceptional leadership and communication skills."
}
```

---

## 🧾 License

This project is licensed under the **MIT License**.  
Feel free to use and modify it as per your needs.

---



⭐ **Star this repo** if you like it — it keeps the motivation high!
