# SaaS File Management System — Backend

Technical Assessment: Subscription-based File & Folder Management System where an Admin defines subscription packages and the system strictly enforces package limits on every user action (folders/files).

## Live URLs
- Backend (Render): https://saas-file-management-system.onrender.com  
- Frontend (Vercel): https://saas-file-management-system-fronten.vercel.app/

## Repositories
- Backend Repo: https://github.com/Masum-Billah-Sifat/saas-file-management-system  
- Frontend Repo: https://github.com/Masum-Billah-Sifat/saas-file-management-system-frontend  

## Tech Stack
- Node.js + Express.js + TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Supabase Storage (file uploads)
- JWT + Sessions (role-based access)
- Zod validation

## Features Implemented

### Authentication
- Register / Login / Logout (JWT access token)
- Session table enforced (revoked session cannot be used)
- Seeded Admin account (default credentials)
- Mock Email Verification (token-based)
- Mock Password Reset (token-based) — USER only (Admin reset disabled by design)

### Admin Panel (Packages)
Admin can create/update/deactivate subscription packages with dynamic limits:
- Max folders
- Max nesting depth
- Allowed file types (Image/Video/PDF/Audio)
- Max file size (MB)
- Total file limit
- Files per folder
Notes:
- Free package is seeded as system package (`isSystem=true`) and protected from deactivation.

### User Panel (Subscription)
- View active packages
- Switch active subscription package (new limits apply forward; existing data preserved)
- Subscription history preserved using `UserSubscription` (endAt=null means active)

### Folder Management
- List folders (flat list; frontend builds tree)
- Create folders/subfolders (depth enforced)
- Rename folder
- Delete folder = archive subtree (soft delete)

### File Management
- List files in folder
- Upload files to folder (Supabase Storage)
- Preview supported via stored publicUrl (frontend modal)
- Download via protected endpoint: returns `{ url }`
- Rename file
- Delete file = archive (soft delete)

### Enforcement Logic (Strict)
Every folder/file action checks the user's active package:
- Folder create → maxFolders + maxNestingLevel
- File upload → allowedTypes + maxFileSizeMB + totalFileLimit + filesPerFolder

## Default Credentials

Admin (seeded):
- Email: admin@zoomit.com
- Password: Admin@12345

User:
- You can register a new user, or test with:
- Email: m.sifat1666690@gmail.com
- Password: 1234567890

## Environment Variables

Create a `.env` file in the backend root:

```env
# Server
PORT=4000
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=1d

# Database (Neon)
DATABASE_URL=postgresql://...

# Supabase Storage
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_BUCKET=uploads

# Base URL used for generating mock links (should point to FRONTEND)
APP_BASE_URL=http://localhost:3000

# Seeded Admin
ADMIN_EMAIL=admin@zoomit.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=ZOOM IT Admin