import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getData, sendData, updateData as updateDataApi } from "../utils/api";

const VideoForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [genreOptions, setGenreOptions] = useState([]);

  const getPlaylistByGroupId = async () => {
    try {
      const response = await getData(`/api/playlist/38`);
      return response;
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  };

  const addPlaylistItem = async (playlistData) => {
    try {
      const formData = new FormData();

      formData.append("play_name", playlistData.play_name);
      formData.append("play_url", playlistData.play_url);
      formData.append("play_thumbnail", playlistData.play_thumbnail);
      formData.append("play_genre", playlistData.play_genre);
      formData.append("play_description", playlistData.play_description);

      const response = await sendData("/api/playlist/38", formData);
      return response;
    } catch (error) {
      console.error("Error adding playlist item:", error);
      throw error;
    }
  };

  const updatePlaylistItem = async (playId, formData) => {
    try {
      const data = new FormData();
      // Mengambil data video yang ada
      const currentVideo = await getPlaylistByGroupId();
      const videoToUpdate = currentVideo.datas.find((v) => v.id_play === parseInt(playId));

      // Menggunakan data baru jika ada, jika tidak gunakan data lama
      data.append("play_name", formData.play_name || videoToUpdate.play_name);
      data.append("play_url", formData.play_url || videoToUpdate.play_url);
      data.append("play_thumbnail", formData.play_thumbnail || videoToUpdate.play_thumbnail);
      data.append("play_genre", formData.play_genre || videoToUpdate.play_genre);
      data.append("play_description", formData.play_description || videoToUpdate.play_description);

      const response = await updateDataApi(`/api/playlist/update/${playId}`, data);
      return response;
    } catch (error) {
      console.error("Error updating playlist item:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchVideo();
    }
    fetchGenres();
  }, [id]);

  const fetchGenres = async () => {
    try {
      const response = await getPlaylistByGroupId();
      if (response?.datas) {
        let uniqueGenres = [...new Set(response.datas.map((video) => video.play_genre))].filter(Boolean);
        uniqueGenres = uniqueGenres.map(g => g === 'song' ? 'music' : g);
        uniqueGenres = [...new Set(uniqueGenres)].filter(g => g !== 'song');
        setGenreOptions(uniqueGenres);
      } else {
        setGenreOptions([]);
      }
    } catch (error) {
      setGenreOptions([]);
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await getPlaylistByGroupId();
      if (response?.datas) {
        const video = response.datas.find((v) => v.id_play === parseInt(id));
        if (video) {
          form.setFieldsValue({
            play_name: video.play_name,
            play_url: video.play_url,
            play_thumbnail: video.play_thumbnail,
            play_genre: video.play_genre,
            play_description: video.play_description,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching video data (fetchVideo):");
      message.error("Gagal mengambil data video");
      navigate("/video");
    }
  };

  const onFinish = async (values) => {
    try {
      let response;
      if (isEdit) {
        response = await updatePlaylistItem(id, values);

        if (response?.status === 200 || response?.datas) {
          message.success("Video berhasil diperbarui");
          navigate("/video");
        } else {
          console.error("Response error:", response);
          message.error("Gagal memperbarui video");
        }
      } else {
        response = await addPlaylistItem(values);
        if (response?.datas) {
          message.success("Video berhasil ditambahkan");
          navigate("/video");
        } else {
          message.error("Gagal menambahkan video");
        }
      }
    } catch (error) {
      console.error("Error detail:", error);
      message.error(isEdit ? "Gagal memperbarui video" : "Gagal menambahkan video");
    }
  };

  return (
    <Card title={isEdit ? "Edit Video" : "Tambah Video Baru"} style={{ width: "100%" }}>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form.Item name="play_name" label="Judul" rules={[{ required: true, message: "Mohon masukkan judul video" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="play_url"
          label="URL YouTube"
          rules={[
            { required: true, message: "Mohon masukkan URL YouTube" },
            { type: "url", message: "Mohon masukkan URL yang valid" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="play_thumbnail"
          label="URL Thumbnail"
          rules={[
            { required: true, message: "Mohon masukkan URL thumbnail" },
            { type: "url", message: "Mohon masukkan URL yang valid" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="play_genre" label="Genre" rules={[{ required: true, message: "Mohon masukkan genre video" }]}>
          <Select
            showSearch
            placeholder="Pilih genre"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            allowClear
          >
            {genreOptions.map((genre) => (
              <Select.Option key={genre} value={genre}>
                {genre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="play_description" label="Deskripsi" rules={[{ required: true, message: "Mohon masukkan deskripsi video" }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#EA4D1E", borderColor: "#EA4D1E", color: "white" }}>
            {isEdit ? "Perbarui Video" : "Tambah Video"}
          </Button>
          <Button style={{ marginLeft: 8, backgroundColor: "#EA4D1E", borderColor: "#EA4D1E", color: "white" }} onClick={() => navigate("/video")}>
            Batal
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default VideoForm;
