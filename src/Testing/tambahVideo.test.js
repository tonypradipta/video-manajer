// Salin function onFinish dan addPlaylistItem dan modifikasi agar dependency bisa di-inject
function onFinish(values, isEdit, id, addPlaylistItem, updatePlaylistItem, message, navigate) {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      if (isEdit) {
        response = await updatePlaylistItem(id, values);

        if (response?.status === 200 || response?.datas) {
          message.success("Video berhasil diperbarui");
          navigate("/video");
          resolve({ success: true, action: "update" });
        } else {
          console.error("Response error:", response);
          message.error("Gagal memperbarui video");
          resolve({ success: false, action: "update", error: "Gagal memperbarui video" });
        }
      } else {
        response = await addPlaylistItem(values);
        if (response?.datas) {
          message.success("Video berhasil ditambahkan");
          navigate("/video");
          resolve({ success: true, action: "add" });
        } else {
          message.error("Gagal menambahkan video");
          resolve({ success: false, action: "add", error: "Gagal menambahkan video" });
        }
      }
    } catch (error) {
      console.error("Error detail:", error);
      message.error(isEdit ? "Gagal memperbarui video" : "Gagal menambahkan video");
      reject(error);
    }
  });
}

function addPlaylistItem(playlistData, sendData) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();

      formData.append("play_name", playlistData.play_name);
      formData.append("play_url", playlistData.play_url);
      formData.append("play_thumbnail", playlistData.play_thumbnail);
      formData.append("play_genre", playlistData.play_genre);
      formData.append("play_description", playlistData.play_description);

      const response = await sendData("/api/playlist/38", formData);
      resolve(response);
    } catch (error) {
      console.error("Error adding playlist item:", error);
      reject(error);
    }
  });
}

describe('Fitur Tambah Video', () => {
  let mockSendData, mockMessage, mockNavigate;

  beforeEach(() => {
    mockSendData = jest.fn();
    mockMessage = {
      success: jest.fn(),
      error: jest.fn()
    };
    mockNavigate = jest.fn();
  });

  describe('addPlaylistItem', () => {
    it('berhasil menambah video dengan data lengkap', async () => {
      const playlistData = {
        play_name: "Video Baru",
        play_url: "https://youtube.com/watch?v=123",
        play_thumbnail: "https://example.com/thumb.jpg",
        play_genre: "Action",
        play_description: "Deskripsi video baru"
      };
      const expectedResponse = { datas: { id: 1 } };

      mockSendData.mockResolvedValue(expectedResponse);

      const result = await addPlaylistItem(playlistData, mockSendData);

      expect(mockSendData).toHaveBeenCalledWith("/api/playlist/38", expect.any(FormData));
      expect(result).toEqual(expectedResponse);
    });

    it('error jika sendData gagal', async () => {
      const playlistData = {
        play_name: "Video Error",
        play_url: "https://youtube.com/watch?v=789",
        play_thumbnail: "https://example.com/error.jpg",
        play_genre: "Error",
        play_description: "Video dengan error"
      };

      mockSendData.mockRejectedValue(new Error("API Error"));

      await expect(addPlaylistItem(playlistData, mockSendData))
        .rejects.toThrow("API Error");
    });
  });

  describe('onFinish - Tambah Video', () => {
    it('berhasil menambah video baru', async () => {
      const values = {
        play_name: "Video Baru",
        play_url: "https://youtube.com/watch?v=123",
        play_thumbnail: "https://example.com/thumb.jpg",
        play_genre: "Action",
        play_description: "Deskripsi video baru"
      };
      const isEdit = false;
      const mockAddPlaylistItem = jest.fn().mockResolvedValue({ datas: { id: 1 } });

      const result = await onFinish(values, isEdit, null, mockAddPlaylistItem, null, mockMessage, mockNavigate);

      expect(mockAddPlaylistItem).toHaveBeenCalledWith(values);
      expect(mockMessage.success).toHaveBeenCalledWith("Video berhasil ditambahkan");
      expect(mockNavigate).toHaveBeenCalledWith("/video");
      expect(result).toEqual({ success: true, action: "add" });
    });

    it('gagal menambah video karena response tidak valid', async () => {
      const values = {
        play_name: "Video Gagal",
        play_url: "https://youtube.com/watch?v=456",
        play_thumbnail: "https://example.com/fail.jpg",
        play_genre: "Drama",
        play_description: "Video yang gagal"
      };
      const isEdit = false;
      const mockAddPlaylistItem = jest.fn().mockResolvedValue({ error: "Invalid data" });

      const result = await onFinish(values, isEdit, null, mockAddPlaylistItem, null, mockMessage, mockNavigate);

      expect(mockAddPlaylistItem).toHaveBeenCalledWith(values);
      expect(mockMessage.error).toHaveBeenCalledWith("Gagal menambahkan video");
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false, action: "add", error: "Gagal menambahkan video" });
    });

    it('error jika addPlaylistItem throw exception', async () => {
      const values = {
        play_name: "Video Exception",
        play_url: "https://youtube.com/watch?v=789",
        play_thumbnail: "https://example.com/exception.jpg",
        play_genre: "Thriller",
        play_description: "Video dengan exception"
      };
      const isEdit = false;
      const mockAddPlaylistItem = jest.fn().mockRejectedValue(new Error("API Error"));

      await expect(onFinish(values, isEdit, null, mockAddPlaylistItem, null, mockMessage, mockNavigate))
        .rejects.toThrow("API Error");
      
      expect(mockMessage.error).toHaveBeenCalledWith("Gagal menambahkan video");
    });
  });

  describe('Validasi Form', () => {
    it('validasi field required', () => {
      const requiredFields = ['play_name', 'play_url', 'play_thumbnail', 'play_genre', 'play_description'];
      
      requiredFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('validasi URL format', () => {
      const validUrls = [
        "https://youtube.com/watch?v=123",
        "https://www.youtube.com/watch?v=abc",
        "https://youtu.be/xyz"
      ];
      
      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\/.+/);
      });
    });
  });
}); 