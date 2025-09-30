const updatePlaylistItem = async (playId, formData) => {
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
    return response;
  } 
    catch (error) {
      console.error("Error updating playlist item:", error);
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
  } 
  catch (error) {
    console.error("Error adding playlist item:", error);
    throw error;
  }
};

const filterVideos = (videos) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Minggu dimulai dari Minggu
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newlyAdded = videos.filter((video) => video.created_at >= today);
  setNewlyAddedVideos(newlyAdded.slice(0, 4)); // Batasi 4 video terbaru
  const thisWeek = videos.filter((video) => video.created_at >= startOfWeek);
  setThisWeekVideos(thisWeek.slice(0, 4));
  const thisMonth = videos.filter((video) => video.created_at >= startOfMonth);
  setThisMonthVideos(thisMonth.slice(0, 4));
};

const handleDelete = async (id) => {
    try {
      const response = await deletePlaylistItem(id);
      if (response instanceof Response) {
        if (response.status === 204 || response.status === 200) {
          message.success("Video berhasil dihapus");
          fetchVideos();
          return;
        }
      }
      if (response?.message === "OK") {
        message.success("Video berhasil dihapus");
        fetchVideos();
      } else {
        message.error("Gagal menghapus video");
      }
    } catch (error) {
      message.error("Gagal menghapus video");
    }
  };


  
  /*playId yang valid/tidak valid,
  formData yang lengkap/parsial/kosong,
  currentVideo.datas yang berisi/missing,
  dan memeriksa hasil FormData serta response/error yang dihasilkan.*/




  //cari video
  const handleSearch = (value) => {
    searchVideos(value);
  };
  const searchVideos = async (value) => {
    try {
      setLoading(true);
      const response = await getData(`/api/playlist/38`);
      if (response?.datas) {
        const filteredVideos = response.datas.filter(
          (video) =>
            video.play_name.toLowerCase().includes(value.toLowerCase()) ||
            video.play_genre.toLowerCase().includes(value.toLowerCase()));
        window.dispatchEvent(
          new CustomEvent("search-video", {
            detail: {
              searchText: value,
              results: filteredVideos,
            },
          }));
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };



//hapus video

