# 🚀 How to Run CampusConnect

Complete step-by-step guide. Follow this exactly and it will work.

---

## 📋 Prerequisites (install once)

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | https://nodejs.org (LTS version) |
| **MongoDB** | v6 or higher | See options below ⬇️ |
| **VS Code** (optional) | latest | https://code.visualstudio.com |

### MongoDB — pick ONE option:

**Option A — MongoDB Atlas (easiest, free cloud DB) ✅ Recommended**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → create a free M0 cluster
3. Click **Connect → Drivers** and copy the connection string
   (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`)
4. In **Network Access** → add IP `0.0.0.0/0` (allow from anywhere)

**Option B — Install MongoDB locally**
- Windows/Mac: https://www.mongodb.com/try/download/community
- Then your connection string is: `mongodb://127.0.0.1:27017/campusconnect`

Verify Node is installed:
```bash
node -v      # should print v18.x.x or higher
npm -v
```

---

## 📦 Step 1 — Extract the zip

Unzip `CampusConnect.zip` anywhere (Desktop / Documents / wherever).
You'll get a folder like:
```
CampusConnect/
├── backend/
├── frontend/
├── README.md
└── HOW_TO_RUN.md   ← you are here
```

---

## 🔧 Step 2 — Setup the Backend

Open a terminal in the `CampusConnect/backend` folder.

### 2a. Create your `.env` file

Copy the example:

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Now open `.env` in any editor and change these values:

```env
PORT=5000
NODE_ENV=development

# Paste YOUR MongoDB connection string here:
MONGO_URI=mongodb://127.0.0.1:27017/campusconnect
# or for Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/campusconnect

CLIENT_ORIGIN=http://localhost:5173

# Change these to any long random strings (min 32 chars each)
JWT_ACCESS_SECRET=replace_this_with_a_long_random_string_at_least_32_chars
JWT_REFRESH_SECRET=another_long_random_string_totally_different_from_above
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

ADMIN_EMAIL=admin@campusconnect.edu
ADMIN_PASSWORD=Admin@12345
```

> 💡 **Tip:** Generate a random secret quickly with:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### 2b. Install dependencies

```bash
npm install
```
(takes ~30–60 seconds)

### 2c. Seed the database with demo data

```bash
npm run seed
```

You'll see:
```
🗄️  MongoDB connected: ...
Seeding…
✅ Seed complete.
Admin login:    admin@campusconnect.edu / Admin@12345
Student login:  ayush@student.edu / Student@123
Faculty login:  meera@faculty.edu / Faculty@123
```

### 2d. Start the backend server

```bash
npm run dev
```

You should see:
```
🗄️  MongoDB connected: ...
🚀 CampusConnect API running on http://localhost:5000
```

**Leave this terminal open** — the backend must keep running.

Quick test — open http://localhost:5000/api/health in browser, should return:
```json
{"status":"ok","uptime":..,"ts":..}
```

---

## 🎨 Step 3 — Setup the Frontend

**Open a NEW terminal** (keep backend one running) in `CampusConnect/frontend` folder.

### 3a. Install dependencies
```bash
npm install
```
(takes 1–2 minutes)

### 3b. Start the dev server
```bash
npm run dev
```

You'll see:
```
VITE v5.x.x  ready in 400 ms
➜  Local:   http://localhost:5173/
```

### 3c. Open the app

Go to **http://localhost:5173** in your browser 🎉

---

## 🔑 Step 4 — Login

On the Login page, click one of the demo buttons on the left panel:

| Role    | Email                        | Password       |
|---------|------------------------------|----------------|
| Student | `ayush@student.edu`          | `Student@123`  |
| Faculty | `meera@faculty.edu`          | `Faculty@123`  |
| Admin   | `admin@campusconnect.edu`    | `Admin@12345`  |

Or click **"Create one"** to register a fresh student/faculty account.

---

## 🎯 What to try

1. **Login as Student** → Dashboard shows your complaints only → click "New Complaint" → raise one
2. **Logout → Login as Admin** → Dashboard shows ALL campus complaints + analytics charts
3. **Open any complaint** → change status/priority → send a reply (chat appears)
4. **Admin → Manage Users** (in sidebar) → change roles, delete users
5. **Profile** → change your avatar color, dept, roll no.

---

## 🛑 To stop the app

Press `Ctrl + C` in both terminals.

To start again later: just run `npm run dev` in each folder (no need to seed again).

---

## ❗ Common Issues

### "MongoNetworkError" / "ECONNREFUSED"
Your `MONGO_URI` is wrong or MongoDB isn't running.
- **Local Mongo:** make sure the `mongod` service is running
- **Atlas:** double-check the connection string and IP whitelist (0.0.0.0/0)

### "Port 5000 already in use"
Change `PORT=5001` in `backend/.env`, then also update `frontend/vite.config.js`:
```js
target: "http://localhost:5001"
```

### "Cannot find module …"
You forgot `npm install`. Run it in the folder that errored.

### CORS errors in the browser
Make sure `CLIENT_ORIGIN=http://localhost:5173` in `backend/.env` matches your frontend URL, and **restart the backend** after changing `.env`.

### Login "Invalid credentials" on demo accounts
You didn't run `npm run seed`. Run it once in the backend folder.

### Frontend loads but calls fail with 401
Refresh the page. If it persists, delete browser cookies for localhost and login again.

---

## 🏗 Build for production (optional)

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build          # outputs to dist/
npm run preview        # test the production build locally
```
Then deploy `frontend/dist` to Vercel/Netlify and the backend to Render/Railway/Fly.io.

Remember to set env vars on your hosting platform and update:
- `CLIENT_ORIGIN` (backend) → your deployed frontend URL
- Frontend axios `baseURL` → your deployed backend URL (or keep the proxy in `vite.config.js` for dev)

---

## 📚 Project layout recap

```
CampusConnect/
├── backend/                # Node + Express + Mongoose
│   ├── controllers/        # auth, complaint, user, stats logic
│   ├── models/             # User.js, Complaint.js
│   ├── routes/             # API endpoint definitions
│   ├── middleware/         # JWT protect, role authorize, validators
│   ├── utils/              # tokens.js (JWT sign/verify), seed.js
│   ├── .env                # ← YOU create this from .env.example
│   └── server.js           # entry point
│
├── frontend/               # React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── pages/          # Landing, Login, Dashboard, ComplaintDetail…
│   │   ├── components/     # Layout, StatCard, Badges, Loader…
│   │   ├── context/        # AuthContext (session + refresh)
│   │   └── api/client.js   # axios instance + auto-refresh interceptor
│   └── vite.config.js      # proxies /api → localhost:5000
│
├── preview.html            # standalone design preview (open in browser)
├── README.md               # architecture + API reference
└── HOW_TO_RUN.md           # this file
```

Enjoy! 🎓
