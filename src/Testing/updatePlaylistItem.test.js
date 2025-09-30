// Unit test untuk updatePlaylistItem menggunakan Jest

// Salin function updatePlaylistItem dan modifikasi agar dependency bisa di-inject
function updatePlaylistItem(playId, formData, getPlaylistByGroupId, updateDataApi) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = new FormData();
      const currentVideo = await getPlaylistByGroupId();
      const videoToUpdate = currentVideo.datas.find((v) => v.id_play === parseInt(playId));
      
      data.append("play_name", formData.play_name || videoToUpdate.play_name);
      data.append("play_url", formData.play_url || videoToUpdate.play_url);
      data.append("play_thumbnail", formData.play_thumbnail || videoToUpdate.play_thumbnail);
      data.append("play_genre", formData.play_genre || videoToUpdate.play_genre);
      data.append("play_description", formData.play_description || videoToUpdate.play_description);
      
      const response = await updateDataApi(`/api/playlist/update/${playId}`, data);
      resolve(response);
    } catch (error) {
      console.error("Error updating playlist item:", error);
      reject(error);
    }
  });
}

// Unit test
describe('updatePlaylistItem', () => {
  let mockGetPlaylistByGroupId, mockUpdateDataApi;

  beforeEach(() => {
    mockGetPlaylistByGroupId = jest.fn();
    mockUpdateDataApi = jest.fn();
  });

  it('berhasil update data video dengan formData lengkap', async () => {
    const playId = 1;
    const formData = {
      play_name: "Video Baru",
      play_url: "https://youtube.com/watch?v=123",
      play_thumbnail: "https://example.com/thumb.jpg",
      play_genre: "Action",
      play_description: "Deskripsi video baru"
    };
    const currentVideo = {
      datas: [{
        id_play: 1,
        play_name: "Video Lama",
        play_url: "https://youtube.com/watch?v=old",
        play_thumbnail: "https://example.com/old.jpg",
        play_genre: "Drama",
        play_description: "Deskripsi lama"
      }]
    };
    const expectedResponse = { status: 200, message: "OK" };

    mockGetPlaylistByGroupId.mockResolvedValue(currentVideo);
    mockUpdateDataApi.mockResolvedValue(expectedResponse);

    const result = await updatePlaylistItem(playId, formData, mockGetPlaylistByGroupId, mockUpdateDataApi);

    expect(mockGetPlaylistByGroupId).toHaveBeenCalled();
    expect(mockUpdateDataApi).toHaveBeenCalledWith(`/api/playlist/update/${playId}`, expect.any(FormData));
    expect(result).toEqual(expectedResponse);
  });

  it('berhasil update data video dengan formData parsial', async () => {
    const playId = 1;
    const formData = {
      play_name: "Video Baru",
      play_genre: "Action"
    };
    const currentVideo = {
      datas: [{
        id_play: 1,
        play_name: "Video Lama",
        play_url: "https://youtube.com/watch?v=old",
        play_thumbnail: "https://example.com/old.jpg",
        play_genre: "Drama",
        play_description: "Deskripsi lama"
      }]
    };
    const expectedResponse = { status: 200, message: "OK" };

    mockGetPlaylistByGroupId.mockResolvedValue(currentVideo);
    mockUpdateDataApi.mockResolvedValue(expectedResponse);

    const result = await updatePlaylistItem(playId, formData, mockGetPlaylistByGroupId, mockUpdateDataApi);

    expect(mockUpdateDataApi).toHaveBeenCalledWith(`/api/playlist/update/${playId}`, expect.any(FormData));
    expect(result).toEqual(expectedResponse);
  });
});
