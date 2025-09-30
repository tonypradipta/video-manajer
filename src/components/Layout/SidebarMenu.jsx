import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { VideoCameraOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getData } from "../../utils/api";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [genres, setGenres] = useState([]);

  const getPlaylistByGroupId = async () => {
    try {
      const response = await getData(`/api/playlist/38`);
      return response;
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await getPlaylistByGroupId();
      if (response?.datas) {
        let uniqueGenres = [...new Set(response.datas.map((video) => video.play_genre))];
        uniqueGenres = uniqueGenres.map(g => g === 'song' ? 'music' : g);
        uniqueGenres = [...new Set(uniqueGenres)].filter(g => g !== 'song');
        setGenres(uniqueGenres);
        console.log("Fetched Genres:", uniqueGenres);
      } else {
        setGenres([]);
        console.log("No data or datas property found in API response for genres.");
      }
    } catch (error) {
      console.error("Gagal mengambil genre:", error);
      setGenres([]);
    }
  };

  const menuItems = [
    {
      key: "/beranda",
      icon: <HomeOutlined />,
      label: "Beranda",
    },
    {
      key: "/video",
      icon: <VideoCameraOutlined />,
      label: "Semua Video",
    },
    {
      key: "genres",
      icon: <VideoCameraOutlined />,
      label: "Genre",
      children: genres.map((genre) => ({
        key: `/video?genre=${genre}`,
        label: genre,
      })),
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    if (location.pathname === "/video") {
      const params = new URLSearchParams(location.search);
      const genre = params.get("genre");
      if (genre) {
        return [`/video?genre=${genre}`];
      } else {
        return ["/video"];
      }
    } else if (location.pathname === "/beranda") {
      return ["/beranda"];
    }
    return [location.pathname];
  };

  return (
    <div className="sidebar-container">
      {/* Logo sudah dimuat di MainLayout.jsx, tidak perlu di sini lagi */}
      <Menu theme="light" mode="inline" selectedKeys={getSelectedKeys()} items={menuItems} onClick={handleMenuClick} className="custom-sidebar-menu" />
    </div>
  );
};

export default SidebarMenu;
