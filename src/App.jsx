import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import VideoList from "./pages/VideoList";
import VideoForm from "./pages/VideoForm";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // Cek status login
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman login */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/beranda" replace /> : <Login />} />

        {/* Rute untuk halaman yang membutuhkan login */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/beranda" replace />} />
          <Route path="beranda" element={<Home />} />
          <Route path="video" element={<VideoList />} />
          <Route path="tambah-video" element={<VideoForm />} />
          <Route path="edit-video/:id" element={<VideoForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Redirect semua rute lain ke beranda jika sudah login, atau ke login jika belum */}
        <Route path="*" element={isLoggedIn ? <Navigate to="/beranda" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
