// Unit test untuk handleSearch dan searchVideos menggunakan Jest

// Salin function handleSearch dan searchVideos dan modifikasi agar dependency bisa di-inject
function handleSearch(value, searchVideos) {
  searchVideos(value);
}

function searchVideos(value, getData, setLoading, dispatchEvent) {
  return new Promise(async (resolve, reject) => {
    try {
      setLoading(true);
      const response = await getData(`/api/playlist/38`);
      
      if (response?.datas) {
        const filteredVideos = response.datas.filter(
          (video) =>
            video.play_name.toLowerCase().includes(value.toLowerCase()) ||
            video.play_genre.toLowerCase().includes(value.toLowerCase())
        );
        
        dispatchEvent(
          new CustomEvent("search-video", {
            detail: {
              searchText: value,
              results: filteredVideos,
            },
          })
        );
        resolve(filteredVideos);
      } else {
        resolve([]);
      }
    } catch (error) {
      console.error("Error searching videos:", error);
      reject(error);
    } finally {
      setLoading(false);
    }
  });
}

// Unit test
describe('handleSearch dan searchVideos', () => {
  let mockGetData, mockSetLoading, mockDispatchEvent;

  beforeEach(() => {
    mockGetData = jest.fn();
    mockSetLoading = jest.fn();
    mockDispatchEvent = jest.fn();
  });

  it('berhasil mencari video berdasarkan nama', async () => {
    const searchValue = "action";
    const mockResponse = {
      datas: [
        { play_name: "Action Movie", play_genre: "Drama" },
        { play_name: "Comedy Show", play_genre: "Comedy" },
        { play_name: "Action Hero", play_genre: "Action" }
      ]
    };

    mockGetData.mockResolvedValue(mockResponse);

    const result = await searchVideos(searchValue, mockGetData, mockSetLoading, mockDispatchEvent);

    expect(mockGetData).toHaveBeenCalledWith(`/api/playlist/38`);
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(result).toHaveLength(2); // Action Movie dan Action Hero
    expect(mockDispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
  });

  it('berhasil mencari video berdasarkan genre', async () => {
    const searchValue = "comedy";
    const mockResponse = {
      datas: [
        { play_name: "Action Movie", play_genre: "Drama" },
        { play_name: "Comedy Show", play_genre: "Comedy" },
        { play_name: "Funny Video", play_genre: "Comedy" }
      ]
    };

    mockGetData.mockResolvedValue(mockResponse);

    const result = await searchVideos(searchValue, mockGetData, mockSetLoading, mockDispatchEvent);

    expect(result).toHaveLength(2); // Comedy Show dan Funny Video
    expect(result[0].play_genre).toBe("Comedy");
    expect(result[1].play_genre).toBe("Comedy");
  });

  it('tidak menemukan video yang cocok', async () => {
    const searchValue = "xyz";
    const mockResponse = {
      datas: [
        { play_name: "Action Movie", play_genre: "Drama" },
        { play_name: "Comedy Show", play_genre: "Comedy" }
      ]
    };

    mockGetData.mockResolvedValue(mockResponse);

    const result = await searchVideos(searchValue, mockGetData, mockSetLoading, mockDispatchEvent);

    expect(result).toHaveLength(0);
    expect(mockDispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
  });
}); 