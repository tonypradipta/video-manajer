import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Button, Spin, Empty, Dropdown, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getData, deleteData } from "../utils/api"; // Mengimpor utility API
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newlyAddedVideos, setNewlyAddedVideos] = useState([]);
  const [thisWeekVideos, setThisWeekVideos] = useState([]);
  const [thisMonthVideos, setThisMonthVideos] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getData("/api/playlist/38"); // Asumsi endpoint untuk semua video
        if (response?.datas) {
          const videos = response.datas.map((video) => ({
            ...video,
            created_at: new Date(video.created_at), // Pastikan created_at adalah objek Date
          }));
          setAllVideos(videos);
          filterVideos(videos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Menambahkan event listener untuk pencarian
    const handleSearch = (event) => {
      const { searchText, results } = event.detail;
      setSearchText(searchText);
      setSearchResults(results);
    };

    window.addEventListener("search-video", handleSearch);

    return () => {
      window.removeEventListener("search-video", handleSearch);
    };
  }, []);

  const filterVideos = (videos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Minggu dimulai dari Minggu
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newlyAdded = videos.filter((video) => video.created_at >= today);
    const thisWeek = videos.filter((video) => video.created_at >= startOfWeek);
    const thisMonth = videos.filter((video) => video.created_at >= startOfMonth);

    setNewlyAddedVideos(newlyAdded.slice(0, 4)); // Batasi 4 video terbaru
    setThisWeekVideos(thisWeek.slice(0, 4));
    setThisMonthVideos(thisMonth.slice(0, 4));
  };

  // Tambahkan handleDelete
  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`/api/playlist/${id}`);
      if (response?.status === 204 || response?.message === "OK") {
        message.success("Video berhasil dihapus");
        // Refresh data
        const response = await getData("/api/playlist/38");
        if (response?.datas) {
          const videos = response.datas.map((video) => ({
            ...video,
            created_at: new Date(video.created_at),
          }));
          setAllVideos(videos);
          filterVideos(videos);
        }
      } else {
        message.error("Gagal menghapus video");
      }
    } catch (error) {
      message.error("Gagal menghapus video");
    }
  };

  // Dropdown items
  const getDropdownItems = (item) => [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => navigate(`/edit-video/${item.id_play}`),
    },
    {
      key: "delete",
      label: "Hapus",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Apakah Anda yakin ingin menghapus video ini?",
          content: "Tindakan ini tidak dapat dibatalkan.",
          okText: "Ya",
          okType: "danger",
          cancelText: "Tidak",
          onOk: () => handleDelete(item.id_play),
        });
      },
    },
  ];

  // Modifikasi renderVideoCards khusus untuk newlyAddedVideos
  const renderVideoCards = (videoArray, withDropdown = false) => {
    if (loading) {
      return (
        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </Col>
      );
    }
    if (videoArray.length === 0) {
      return (
        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
          <Empty description="Tidak ada video ditemukan" />
        </Col>
      );
    }
    return videoArray.map((video) => (
      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={video.id_play} style={{ marginBottom: "16px" }}>
        <div style={{ position: "relative" }}>
          <Card
            hoverable
            cover={<img alt={video.play_name} src={video.play_thumbnail} style={{ height: "180px", objectFit: "cover" }} />}
            onClick={() => window.open(video.play_url, "_blank")}
          >
            <Card.Meta title={video.play_name} />
          </Card>
          {withDropdown && (
            <div
              style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
              onClick={e => e.stopPropagation()} // Mencegah event bubbling ke Card
            >
              <Dropdown menu={{ items: getDropdownItems(video) }} trigger={["click"]} placement="bottomRight">
                <MoreOutlined style={{ fontSize: 22, background: "#EA4D1E", color: "white", borderRadius: "50%", padding: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.12)", cursor: "pointer" }} />
              </Dropdown>
            </div>
          )}
        </div>
      </Col>
    ));
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "24px" }}>
        <Button type="primary" style={{ backgroundColor: "#EA4D1E", borderColor: "#EA4D1E", height: "40px", borderRadius: "5px" }} onClick={() => navigate("/tambah-video")}>
          Tambah video baru
        </Button>
      </div>

      {searchText ? (
        <>
          <h3 style={{ marginBottom: "16px" }}>Hasil Pencarian: {searchText}</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(searchResults || [])}</Row>
        </>
      ) : (
        <>
          <h3 style={{ marginBottom: "16px" }}>Baru ditambahkan</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(newlyAddedVideos, true)}</Row>

          <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Minggu ini</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(thisWeekVideos, true)}</Row>

          <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Bulan ini</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(thisMonthVideos, true)}</Row>
        </>
      )}
    </div>
  );
};

export default Home;
