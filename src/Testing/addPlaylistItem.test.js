// Unit test untuk addPlaylistItem menggunakan Jest

// Salin function addPlaylistItem dan modifikasi agar dependency bisa di-inject
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

// Unit test
describe('addPlaylistItem', () => {
  let mockSendData;

  beforeEach(() => {
    mockSendData = jest.fn();
  });

  it('berhasil menambah video dengan data lengkap', async () => {
    const playlistData = {
      play_name: "Video Baru",
      play_url: "https://youtube.com/watch?v=123",
      play_thumbnail: "https://example.com/thumb.jpg",
      play_genre: "Action",
      play_description: "Deskripsi video baru"
    };
    const expectedResponse = { status: 200, message: "OK", datas: { id: 1 } };

    mockSendData.mockResolvedValue(expectedResponse);

    const result = await addPlaylistItem(playlistData, mockSendData);

    expect(mockSendData).toHaveBeenCalledWith("/api/playlist/38", expect.any(FormData));
    expect(result).toEqual(expectedResponse);
  });

  it('gagal menambah video dengan data minimal karena form tidak lengkap', async () => {
    const playlistData = {
      play_name: "Video Minimal",
      play_url: "https://youtube.com/watch?v=456",
      play_thumbnail: "",
      play_genre: "",
      play_description: ""
    };
    const errorResponse = { 
      status: 400, 
      message: "Form harus diisi lengkap",
      error: "VALIDATION_ERROR"
    };
    mockSendData.mockResolvedValue(errorResponse);
    const result = await addPlaylistItem(playlistData, mockSendData);
    expect(mockSendData).toHaveBeenCalledWith("/api/playlist/38", expect.any(FormData));
    expect(result).toEqual(errorResponse);
    expect(result.status).toBe(400);
    expect(result.message).toBe("Form harus diisi lengkap");
  });
}); 