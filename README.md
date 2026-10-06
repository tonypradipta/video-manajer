# 🎬 Essential Video Manager

> Web-based video management application for organizing, searching, previewing, adding, editing, and deleting video content through a clean dashboard interface.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-0170FE?logo=antdesign&logoColor=white)](https://ant.design/)
[![React Router](https://img.shields.io/badge/React%20Router-7.x-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/API-Fetch%20%2F%20Axios-5A29E4)](https://axios-http.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Essential Video** is a React-based video management dashboard developed by **Bodrex Team**. The application provides a centralized interface for managing a video playlist connected to a remote API.

It is designed as a web-development project that demonstrates authentication flow, protected routes, REST API integration, CRUD operations, search and filtering, pagination, thumbnail preview, and responsive dashboard components.

---

## ✨ Features

### 🔐 Authentication
- Login page with username and password form.
- Protected application routes using a private-route component.
- Login state handled through browser storage.
- JWT storage utility using encrypted storage.
- Logout functionality from the profile page.

### 🎥 Video Management
- View video collection from the API.
- Add new videos.
- Edit existing videos.
- Delete videos with confirmation.
- Open video links directly on YouTube.
- Display video thumbnails and descriptions.
- Preview thumbnails in a modal.

### 🔎 Search & Filtering
- Search videos by title or genre.
- Filter videos by genre through URL parameters.
- Header-based search event handling.
- Search results displayed dynamically.

### 📊 Dashboard
- Recently added videos.
- Videos added during the current week.
- Videos added during the current month.
- Quick access to add, edit, and delete actions.

### 📄 Pagination
- Paginated video list.
- 10 videos displayed per page.
- Total video count indicator.

### 🎨 UI & Experience
- Built with Ant Design components.
- Consistent orange primary theme.
- Sidebar navigation.
- Header search.
- Responsive video cards and layouts.
- Loading and empty states.
- Confirmation dialogs and feedback messages.

---

## 🧩 Application Flow

```text
                    ┌──────────────────┐
                    │   Login Page     │
                    └────────┬─────────┘
                             │
                         Authenticate
                             │
                             ▼
                    ┌──────────────────┐
                    │   Private Route  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Dashboard    │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         Video List     Add Video     Profile
              │             │
       ┌──────┼──────┐      │
       ▼      ▼      ▼      ▼
     Search  Edit  Delete  Create
       │      │      │
       └──────┴──────┴──────────┐
                                ▼
                         Remote REST API
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Frontend UI development |
| **Vite 6** | Development server and production bundler |
| **Ant Design 5** | UI components and dashboard interface |
| **React Router 7** | Client-side routing and protected routes |
| **Fetch API / Axios dependency** | API communication |
| **Encrypt Storage** | Encrypted browser storage for authentication token |
| **ESLint 9** | Code quality and linting |
| **Jest** | Testing dependency |

---

## 📁 Project Structure

```text
video-manajer/
├── public/
│   ├── Essential Video.png
│   └── Login.png
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── SidebarMenu.jsx
│   │   │   └── HeaderSearch.jsx
│   │   └── PrivateRoute.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── VideoForm.jsx
│   │   └── VideoList.jsx
│   │
│   ├── utils/
│   │   ├── api.jsx
│   │   └── jwt_storage.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env.development
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- **Node.js** 18+
- **npm** 9+
- Git

Check your versions:

```bash
node --version
npm --version
git --version
```

### 1. Clone the repository

```bash
git clone https://github.com/tonypradipta/video-manajer.git
cd video-manajer
```

The default branch for this project is:

```bash
video-manajer
```

If necessary:

```bash
git checkout video-manajer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.development` file in the project root:

```env
VITE_REACT_APP_API_URL=https://your-api-domain.example
VITE_REACT_APP_SECRET_KEY_STORE=your-development-secret
VITE_REACT_APP_ENABLE_STRICT_MODE=false
```

The application reads the API base URL using Vite's `import.meta.env` environment variables.

> **Security:** never commit real API secrets, encryption keys, passwords, or private credentials to Git. Use local environment files and make sure sensitive files are covered by `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🔌 API Integration

The application communicates with a remote REST API through helper functions located in:

```text
src/utils/api.jsx
```

The API base URL is configured with:

```env
VITE_REACT_APP_API_URL=...
```

### Main operations

| Operation | Method | Example Endpoint |
|---|---|---|
| Get playlist | GET | `/api/playlist/38` |
| Add video | POST | `/api/playlist/38` |
| Update video | POST | `/api/playlist/update/:id` |
| Delete video | DELETE | `/api/playlist/:id` |

### Video data

The application works with video properties such as:

```text
play_name
play_url
play_thumbnail
play_genre
play_description
created_at
id_play
```

---

## 🧭 Main Routes

| Route | Description | Access |
|---|---|---|
| `/login` | Login page | Public |
| `/beranda` | Dashboard / home | Protected |
| `/video` | Video list | Protected |
| `/tambah-video` | Add new video | Protected |
| `/edit-video/:id` | Edit video | Protected |
| `/profile` | User profile and logout | Protected |

---

## 🎬 Video Management Workflow

### Add Video

1. Open **Tambah Video Baru**.
2. Enter the video title.
3. Enter the YouTube URL.
4. Enter the thumbnail URL.
5. Select a genre.
6. Add a description.
7. Submit the form.
8. The application sends the data to the playlist API.

### Edit Video

1. Open the video list.
2. Select the action menu.
3. Choose **Edit**.
4. Update the required information.
5. Submit the form.
6. The updated data is sent to the API.

### Delete Video

1. Open the action menu on a video.
2. Select **Hapus**.
3. Confirm the deletion.
4. The application sends a DELETE request to the API.
5. The video list is refreshed after a successful request.

---

## 🔐 Authentication Notes

The current project contains a frontend authentication flow with protected routes and browser storage.

For development/demo purposes, the login implementation currently performs credential checking on the client side. **This should not be considered production-grade authentication.**

For production use, authentication should be moved to a secure backend service with:

- Server-side credential validation.
- Password hashing.
- Proper JWT/session handling.
- Token expiration and refresh.
- Role-based authorization.
- Secure HTTP-only cookies where appropriate.
- CSRF and XSS protections.

---

## 🧪 Testing & Code Quality

The project includes Jest as a development dependency and ESLint for code-quality checks.

Run linting with:

```bash
npm run lint
```

Before creating a production build, it is recommended to run:

```bash
npm run lint
npm run build
```

---

## 📦 Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## ⚠️ Current Limitations

The current implementation is primarily a frontend application and depends on an external API.

Some areas that can be improved for production include:

- [ ] Move authentication completely to the backend.
- [ ] Add role-based access control.
- [ ] Add proper session/JWT refresh handling.
- [ ] Add automated unit and integration tests.
- [ ] Add upload support instead of requiring thumbnail URLs.
- [ ] Add stronger form validation.
- [ ] Add error boundaries and centralized API error handling.
- [ ] Add environment validation.
- [ ] Add CI/CD pipeline.
- [ ] Add production deployment configuration.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Add confirmation and audit logging for destructive actions.

---

## 👥 Bodrex Team

This project was developed by **Bodrex Team**:

| Name | Student ID |
|---|---|
| I Gede Surya Dharma Putra | 2315091076 |
| I Putu Tonyco Satria Pradipta | 2315091058 |
| I Gusti Ngurah Arya Wirahadi Pratama Putra | 2215091084 |
| Timothy Sitanggang | 2315091035 |

---

## 🎯 Project Purpose

Essential Video was created as a web development project to practice and demonstrate:

- React application development.
- Component-based UI architecture.
- REST API integration.
- CRUD implementation.
- Client-side routing.
- Protected routes.
- Authentication concepts.
- Search and filtering.
- Pagination.
- Form validation.
- Modern dashboard UI development.

---

## 🤝 Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Run lint and build checks:

```bash
npm run lint
npm run build
```

5. Commit your changes:

```bash
git commit -m "feat: add your feature"
```

6. Push the branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

## 📄 License

This project is available for educational and development purposes.

If you plan to distribute or reuse the project, add the appropriate license file and update this section accordingly.

---

## 👨‍💻 Author

**Tony Pradipta**

GitHub: [@tonypradipta](https://github.com/tonypradipta)

---

<div align="center">

**Essential Video — Manage your video content in one place. 🎬**

</div>
