// Unit test untuk handleDelete menggunakan Jest

// Salin function handleDelete dan modifikasi agar dependency bisa di-inject
function handleDelete(id, deletePlaylistItem, message, fetchVideos) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await deletePlaylistItem(id);

      if (response instanceof Response) {
        if (response.status === 204 || response.status === 200) {
          message.success("Video berhasil dihapus");
          fetchVideos();
          resolve({ success: true, status: response.status });
          return;
        }
      }

      if (response?.message === "OK") {
        message.success("Video berhasil dihapus");
        fetchVideos();
        resolve({ success: true, message: "OK" });
      } else {
        message.error("Gagal menghapus video");
        resolve({ success: false, error: "Gagal menghapus video" });
      }
    } catch (error) {
      message.error("Gagal menghapus video");
      reject(error);
    }
  });
}

// Unit test
describe('handleDelete', () => {
  let mockDeletePlaylistItem, mockMessage, mockFetchVideos;

  beforeEach(() => {
    mockDeletePlaylistItem = jest.fn();
    mockMessage = {
      success: jest.fn(),
      error: jest.fn()
    };
    mockFetchVideos = jest.fn();
  });

  it('berhasil menghapus video dengan response message OK', async () => {
    const id = 1;
    const mockResponse = { message: "OK" };

    mockDeletePlaylistItem.mockResolvedValue(mockResponse);

    const result = await handleDelete(id, mockDeletePlaylistItem, mockMessage, mockFetchVideos);

    expect(mockDeletePlaylistItem).toHaveBeenCalledWith(id);
    expect(mockMessage.success).toHaveBeenCalledWith("Video berhasil dihapus");
    expect(mockFetchVideos).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: "OK" });
  });
}); 