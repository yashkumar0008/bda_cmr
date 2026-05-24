# BDA CRM — Sales Pipeline Management System
### Full-Stack MERN Application | Manufacturing Company CRM

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, React Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JWT + bcryptjs |
| **File Uploads** | Cloudinary + express-fileupload |
| **Dev Tools** | Nodemon, dotenv |

---

## 📁 Project Structure

```
crm/
├── client/                    # React Frontend
│   └── src/
│       ├── api/               # Axios instance
│       ├── components/
│       │   ├── common/        # Spinner, Modal, Badge, EmptyState, ConfirmDialog
│       │   ├── layout/        # Sidebar, Topbar
│       │   └── leads/         # LeadForm
│       ├── context/           # AuthContext, ToastContext
│       ├── layouts/           # DashboardLayout
│       ├── pages/             # All page components
│       ├── routes/            # ProtectedRoute
│       ├── types/             # TypeScript interfaces
│       └── utils/             # Formatters, constants
│
└── server/                    # Express Backend
    ├── config/                # DB, Cloudinary config
    ├── controllers/           # Auth, Lead, FollowUp, Activity, User
    ├── middleware/            # auth.js, error.js
    ├── models/                # User, Lead, Activity, FollowUp
    ├── routes/                # All API routes
    ├── utils/                 # generateToken, apiResponse
    ├── seed.js                # Demo data seeder
    └── server.js              # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bda_crm
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudname
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

**client/.env** (optional, defaults to localhost:5000)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data
```bash
cd server && node seed.js
```

### 4. Run Development Servers
```bash
# Terminal 1 — Backend
cd server && npm run dev      # http://localhost:5000

# Terminal 2 — Frontend
cd client && npm run dev      # http://localhost:5173
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@bdacrm.com | Admin@123 |
| **Sales Manager** | sarah@bdacrm.com | Sarah@123 |
| **BDA Employee** | raj@bdacrm.com | Raj@123 |
| **BDA Employee** | priya@bdacrm.com | Priya@123 |

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
GET    /api/auth/me                Get current user (protected)
PUT    /api/auth/profile           Update profile (protected)
POST   /api/auth/avatar            Upload avatar (protected)
PUT    /api/auth/change-password   Change password (protected)
```

### Leads
```
GET    /api/leads                  Get all leads (paginated, filtered)
POST   /api/leads                  Create lead
GET    /api/leads/:id              Get single lead
PUT    /api/leads/:id              Update lead
DELETE /api/leads/:id              Delete lead (Admin/Manager)
PUT    /api/leads/:id/assign       Assign lead (Admin/Manager)
PUT    /api/leads/:id/status       Update status (Kanban drag-drop)
POST   /api/leads/:id/attachments  Upload attachment
GET    /api/leads/stats            Dashboard statistics
GET    /api/leads/pipeline         Pipeline grouped by status
```

### Follow-ups
```
GET    /api/followups              Get follow-ups (filtered by status)
POST   /api/followups              Schedule follow-up
PUT    /api/followups/:id          Update follow-up
PUT    /api/followups/:id/complete Mark as complete
DELETE /api/followups/:id          Delete follow-up
```

### Activities
```
GET    /api/activities             Get activity log
```

### Users
```
GET    /api/users                  Get all users
GET    /api/users/:id              Get user
PUT    /api/users/:id              Update user (Admin)
DELETE /api/users/:id              Delete user (Admin)
```

---

## 🎯 Features by Role

### Admin
- ✅ Full CRUD on leads and users
- ✅ Assign leads to any BDA
- ✅ Access all dashboards and analytics
- ✅ Manage team members
- ✅ System settings

### Sales Manager
- ✅ Create, view, and edit leads
- ✅ Assign leads to BDA employees
- ✅ View team performance analytics
- ✅ Manage follow-ups
- ❌ Cannot delete leads or users

### BDA Employee
- ✅ View and update only assigned leads
- ✅ Schedule and complete follow-ups
- ✅ Update lead status via Kanban
- ❌ Cannot delete leads
- ❌ Cannot access team management

---

## 🖥️ Pages

| Page | Route | Access |
|------|-------|--------|
| Login | /login | Public |
| Register | /register | Public |
| Dashboard | /dashboard | All |
| Leads | /leads | All |
| Kanban Pipeline | /pipeline | All |
| Follow-ups | /followups | All |
| Analytics | /analytics | All |
| Team | /team | Admin, Manager |
| Profile | /profile | All |
| Settings | /settings | Admin |

---

## 🏗️ Architecture Highlights

- **MVC Pattern** — Controllers, Models, Routes cleanly separated
- **JWT Middleware** — All protected routes verify token from `Authorization: Bearer`
- **Role Middleware** — `authorize(...roles)` restricts endpoints by user role
- **Centralized Error Handler** — Handles Mongoose cast errors, duplicate keys, validation
- **Activity Logging** — Every lead action auto-logged to Activity collection
- **Text Search** — MongoDB text index on Lead (companyName, contactPerson, email)
- **Pagination** — All list endpoints support `?page=1&limit=10`
- **Cloudinary** — Profile avatars and lead attachments stored in cloud
