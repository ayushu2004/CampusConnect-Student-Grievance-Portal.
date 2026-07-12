# 🎓 CampusConnect — Student Grievance Portal

A modern, full-stack **MERN** grievance portal with a polished dark/glassmorphism UI, production-grade **JWT auth (access + rotating refresh tokens in httpOnly cookies)**, role-based access control (student / faculty / admin), threaded conversations, live analytics dashboards and more.

> This is a complete rewrite / redesign of the earlier basic version — cleaner architecture, real APIs, real security, and a UI worth showing off in a portfolio.

---

## ✨ Highlights

- **Auth done right** — access token (15 min) in memory + refresh token (7 d) in httpOnly cookie, **rotated on every refresh**, hashed and stored server-side. Silent refresh via Axios interceptors.
- **Role-based access control** — `student`, `faculty`, `admin` with route- and API-level guards.
- **Anonymous complaints** — identity hidden from all non-admin viewers.
- **Threaded conversations** — students and admins reply on the same ticket like a chat.
- **Live analytics** — status/category/priority breakdowns + 14-day trend chart (Recharts).
- **Search + filters + pagination** on the complaints list.
- **Modern UI** — React 18, Tailwind CSS, Framer Motion animations, Lucide icons, dark glassmorphism theme.
- **Security** — Helmet, CORS, rate limiting on `/auth/*`, express-validator, bcrypt (cost 12).

---

## 🧱 Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · React Router 6 · Axios · Recharts · Lucide · React Hot Toast
**Backend:** Node.js · Express 4 · MongoDB · Mongoose · JWT · bcryptjs · Helmet · express-rate-limit · express-validator

---

## 📁 Project Structure

```
CampusConnect/
├── backend/
│   ├── config/db.js
│   ├── controllers/         # auth, complaint, user, stats
│   ├── middleware/          # auth (JWT), validate, error
│   ├── models/              # User, Complaint (+responses subdoc)
│   ├── routes/              # /api/auth /api/complaints /api/users /api/stats
│   ├── utils/               # tokens, seed
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/client.js            # axios + refresh interceptor
    │   ├── context/AuthContext.jsx  # session + bootstrap on load
    │   ├── components/              # Layout, Loader, StatCard, Badges, Logo…
    │   ├── pages/                   # Landing, Login, Register, Dashboard,
    │   │                            # ComplaintsList, NewComplaint, ComplaintDetail,
    │   │                            # Profile, AdminUsers
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js               # proxies /api → http://localhost:5000
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env         # fill MONGO_URI + secrets
npm install
npm run seed                 # creates demo admin/student/faculty + sample complaints
npm run dev                  # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

Vite proxies `/api` → `http://localhost:5000`, so no CORS headache in dev.

### 3. Demo credentials (after seeding)

| Role    | Email                          | Password       |
|---------|--------------------------------|----------------|
| Admin   | `admin@campusconnect.edu`      | `Admin@12345`  |
| Faculty | `meera@faculty.edu`            | `Faculty@123`  |
| Student | `ayush@student.edu`            | `Student@123`  |

The Login page has one-click buttons to auto-fill these.

---

## 🔐 Auth Flow

1. **Register / Login** → server returns `accessToken` in JSON + sets `cc_rt` (refresh) as **httpOnly**, **SameSite** cookie scoped to `/api/auth`.
2. Frontend keeps the access token **in memory only** (never `localStorage` — safer against XSS).
3. On every response `401`, Axios calls `POST /api/auth/refresh`, receives a **new** access token and a **rotated** refresh token; the original request is replayed transparently.
4. Refresh token is **hashed with bcrypt** and stored on the user; logout clears it server-side.
5. Public register endpoint refuses to create `admin` accounts — only existing admins can promote via `/api/users/:id/role`.

---

## 📡 API (short reference)

```
POST   /api/auth/register        { name, email, password, rollNo?, department?, role? }
POST   /api/auth/login           { email, password }
POST   /api/auth/refresh         (uses cookie)
POST   /api/auth/logout
GET    /api/auth/me              (Bearer)

GET    /api/complaints           ?status&category&priority&q&mine&page&limit&sort
POST   /api/complaints           { title, description, category, priority?, anonymous? }
GET    /api/complaints/:id
PATCH  /api/complaints/:id/status   (admin/faculty)  { status?, priority?, assignedTo? }
POST   /api/complaints/:id/responses { message }
POST   /api/complaints/:id/upvote
DELETE /api/complaints/:id       (owner or admin)

GET    /api/users                (admin)
PATCH  /api/users/me             { name?, department?, rollNo?, avatarColor? }
PATCH  /api/users/:id/role       (admin)
DELETE /api/users/:id            (admin)

GET    /api/stats/overview       (scoped by role)
```

---

## 🖼 Screens

- Landing (hero + feature grid + CTA)
- Login / Register (split layout, glassmorphism)
- Dashboard (KPIs + area trend + category pie + recent activity)
- Complaints list (search, filters, pagination, status/priority badges)
- Complaint detail (full ticket + admin status controls + chat-style conversation + upvote)
- Profile (avatar color, dept, roll no.)
- Admin → Manage Users (role change, delete)

---

## 🛡 Security Notes

- Passwords hashed with **bcrypt cost 12**.
- Refresh tokens **hashed** at rest and **rotated** on every refresh (detects reuse).
- Access token **never** persisted in browser storage.
- Helmet + strict CORS + rate limiter on auth endpoints.
- express-validator on all mutating routes.
- Anonymous complaints strip `createdBy` from non-privileged responses.

---

## 📦 Scripts

**Backend**
```bash
npm run dev    # nodemon
npm start      # node server.js
npm run seed   # wipe + seed demo data
```

**Frontend**
```bash
npm run dev
npm run build
npm run preview
```

---

## 📄 License

MIT — free to use, learn from, and extend.
