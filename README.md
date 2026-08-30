# TXG Gateway - All-in-One Full Stack Web Application

Full-stack production ready **TXG Gateway** web application with React Frontend, Node.js + Express Backend Server, and **SQLite Database** (`database.sqlite`).

---

## 📂 Project Structure

```
txg-gateway/
├── backend/
│   ├── server.js          # Express API server (Port 5000)
│   ├── db.js              # SQLite Database setup & table schemas
│   ├── database.sqlite    # Embedded SQLite Database file
│   └── package.json       # Express + SQLite dependencies
├── src/                   # React Frontend (Vite + Tailwind)
├── index.html
├── package.json           # Frontend dependencies
├── vite.config.js
└── README.md
```

---

## ⚡ How to Run the Project (Step-by-Step)

### Step 1: Start the Backend Server (Express + SQLite)
Open a terminal in the project directory:
```bash
cd backend
npm install
npm start
```
*The Express backend server with SQLite database will launch at `http://localhost:5000`.*

---

### Step 2: Start the Frontend Application (React + Vite)
Open a **second** terminal window in the root directory:
```bash
npm install
npm run dev
```
*The React frontend app will launch at `http://localhost:3000`.*

---

## 🔐 Credentials & Secrets

### 1. Hidden Admin & Owner Portals (Tap 7 Times on TXG GATEWAY Title):
- **👑 Owner Portal Login**:
  - **Username**: `TXG#master`
  - **Password**: `TXG@ownermaster001`
- **🛡️ Admin Portal Login**:
  - **Username**: `AdminTXG#team701`
  - **Password**: `TXG@teamkey9012`

---

### 2. Telegram Bot Integration (@TXGGATEWAY_bot):
- **Bot Token**: `8818889322:AAHk-tw3ZO961EVonj1zI7hb1p8KK12yT6o`
- **Bot Link**: `http://t.me/TXGGATEWAY_bot`
- **Bot Commands**:
  - `/start`: Hello message + 6-digit verification OTP (valid for 30s)
  - `/balance`: Fetches user balance directly from the SQLite Database!

---

### 3. Add Fund UPI Details:
- **UPI ID**: `skimran876@fam`
