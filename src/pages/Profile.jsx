import React from "react";
import { Button, Avatar, Card, Descriptions, Space, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { jwtStorage } from "../utils/jwt_storage";

const Profile = () => {
  const navigate = useNavigate();
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812-3456-7890",
    dob: "10 Januari 1990",
    bio: "Seorang penggemar video dan kreator konten. Senang berbagi dan belajar hal baru.",
    profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Dummy profile picture URL
  };

  const handleLogout = async () => {
    await jwtStorage.removeItem();
    localStorage.removeItem("isLoggedIn");
    message.success("Logout berhasil");
    navigate("/login");
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <Space align="center">
            <Avatar size={64} src={userData.profilePic} icon={<UserOutlined />} />
            <h3 style={{ margin: 0 }}>{userData.name}</h3>
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">
            <MailOutlined style={{ marginRight: "8px" }} />
            {userData.email}
          </Descriptions.Item>
          <Descriptions.Item label="Telepon">
            <PhoneOutlined style={{ marginRight: "8px" }} />
            {userData.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Lahir">
            <CalendarOutlined style={{ marginRight: "8px" }} />
            {userData.dob}
          </Descriptions.Item>
          <Descriptions.Item label="Bio">{userData.bio}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" danger style={{ marginTop: 24 }} onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
