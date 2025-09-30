import React, { useState, useCallback, useRef } from "react";
import { Input, Avatar, Button, message } from "antd";
import { UserOutlined, AudioOutlined, BellOutlined, SearchOutlined } from "@ant-design/icons";
import { getData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HeaderSearch = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const searchVideos = async (value) => {
    try {
      setLoading(true);
      const response = await getData(`/api/playlist/38`);

      if (response?.datas) {
        const filteredVideos = response.datas.filter((video) => video.play_name.toLowerCase().includes(value.toLowerCase()) || video.play_genre.toLowerCase().includes(value.toLowerCase()));

        window.dispatchEvent(
          new CustomEvent("search-video", {
            detail: {
              searchText: value,
              results: filteredVideos,
            },
          })
        );
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    searchVideos(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim() === "") {
      // Jika input kosong, tampilkan semua video
      getData(`/api/playlist/38`)
        .then((response) => {
          if (response?.datas) {
            window.dispatchEvent(
              new CustomEvent("search-video", {
                detail: {
                  searchText: "",
                  results: response.datas,
                },
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching all videos:", error);
        });
    } else {
      // Set new timeout
      searchTimeout.current = setTimeout(() => {
        searchVideos(value);
      }, 300);
    }
  };

  // Voice search handler
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.error("Browser tidak mendukung fitur voice recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    message.info("Silakan bicara...");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchValue(transcript);
      if (inputRef.current) {
        inputRef.current.input.value = transcript;
      }
      searchVideos(transcript);
    };
    recognition.onerror = (event) => {
      message.error("Voice recognition error: " + event.error);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
        <Input.Search
          ref={inputRef}
          placeholder="Cari video..."
          allowClear
          loading={loading}
          style={{ width: "100%" }}
          value={searchValue}
          onSearch={handleSearch}
          onChange={handleChange}
          enterButton={
            <Button
              type="primary"
              style={{
                backgroundColor: "#EA4D1E",
                borderColor: "#EA4D1E",
                color: "white",
              }}
              icon={<SearchOutlined style={{ color: "white" }} />}
            />
          }
        />
        <AudioOutlined onClick={handleVoiceSearch} style={{ fontSize: "20px", marginLeft: "16px", cursor: "pointer", color: "#EA4D1E" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", position: "absolute", right: "16px" }}>
        <Avatar size={40} icon={<UserOutlined style={{ color: "white" }} />} onClick={() => navigate("/profile")} style={{ cursor: "pointer", backgroundColor: "#EA4D1E" }} />
      </div>
    </div>
  );
};

export default HeaderSearch;
