# Blog & Dashboard CMS

This is a **blog CMS editor built on the MERN stack (MongoDB, Express, React, Node.js)**.  
The application features a **rich text editor powered by Editor.js**, allowing you to create posts with titles, bold/italic text, images, file uploads, embedded content, and quotes.  
You can **pin posts** for quick access, create **subpages (categories)**, and manage posts with full **create, edit, and delete functionality**.  
There is also an **upload files viewer** for managing media assets.  
The **home page** displays a welcome message, **pinned posts**, and the **three latest posts**.

- **App Deployment:** [https://bloganddashboard.onrender.com](https://bloganddashboard.onrender.com)
- **GitHub Repository:** [https://github.com/alkisax/BlogAndDashboard](https://github.com/alkisax/BlogAndDashboard)
- **README:** [README.md](https://github.com/alkisax/BlogAndDashboard/blob/main/README.md)
---

## **Tech Stack**

### **Backend**
- **Node.js** with **Express** for REST API
- **MongoDB** with **Mongoose** for data storage
- **JWT Authentication** for admin login
- **Multer** for file uploads
- **Winston + winston-mongodb** for logging
- **Swagger (OpenAPI 3.1)** for API documentation
- **bcrypt** for password hashing
- **dotenv** for environment configuration

### **Frontend**
- **React (Vite + React Router)** for the SPA
- **Tailwind CSS** for styling
- **Editor.js** (with plugins: header, paragraph, list, quote, embed, image, attaches, inline code, etc.)
- **Axios** for API requests
- **React Paginate** for pagination
- **DOMPurify** for sanitizing rendered content

---

## **Features**
- **Rich Text Editor (Editor.js)**:
  - Supports titles, paragraphs, bold, italic, quotes, lists, images, file attachments, and embeds.
- **Admin Dashboard**:
  - Create, edit, delete, and pin posts.
  - Create new subpages (categories).
  - Manage uploaded files (view and delete).
- **Authentication**:
  - Admin login using JWT tokens.
- **Blog Pages**:
  - Subpage view showing posts by category.
  - Pinned posts highlighted.
  - Pagination for large content sets.
- **Homepage**:
  - Displays a welcome message, pinned posts, and the three latest posts.
- **API Documentation**:
  - Accessible via `/api-docs` using Swagger UI.

---

## **API Endpoints**

### **Authentication**
- `POST /api/login` – Admin login
- `GET /auth/google/callback` – Google OAuth login callback

### **Admin**
- `GET /api/admin` – Get all admins (JWT required)
- `POST /api/admin` – Create a new admin
- `DELETE /api/admin/:id` – Delete an admin by ID (JWT required)

### **Posts**
- `POST /api/posts` – Create a new post (JWT required)
- `GET /api/posts` – Get all posts
- `GET /api/posts/:postId` – Get a post by ID
- `PUT /api/posts/:postId` – Edit a post by ID (JWT required)
- `DELETE /api/posts/:postId` – Delete a post by ID (JWT required)

### **SubPages**
- `POST /api/subPages` – Create a new subpage
- `GET /api/subPages` – Get all subpages

### **Uploads**
- `GET /api/uploads` – Get all uploaded files
- `POST /api/uploads` – Upload a new file
- `DELETE /api/uploads/:id` – Delete an uploaded file by ID

---

## **Installation & Running Locally**

### **Backend**
```bash
cd backend
npm install
npm run dev
The backend will run at http://localhost:3001.
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
The frontend will run at http://localhost:5173.
```

Swagger API Docs
Swagger documentation is available at:

```bash
http://localhost:3001/api-docs
```
(or your production backend URL).

## Screenshots
## Screenshots

### CMS Editor
![CMS Editor](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/cmsEditor.png)

### Files Viewer
![Files](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/files.png)

### Homepage
![Homepage](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/homepage.png)

### Login
![Login](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/login.png)

### Post View
![Post View](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/postView.png)

### Subpage
![Subpage](https://github.com/alkisax/BlogAndDashboard/blob/main/screenShots/subpage.png)
