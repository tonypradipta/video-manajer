// Unit test untuk filterVideos menggunakan Jest

// Salin function filterVideos dan modifikasi agar setter bisa di-inject
function filterVideos(videos, setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newlyAdded = videos.filter((video) => video.created_at >= today);
  const thisWeek = videos.filter((video) => video.created_at >= startOfWeek);
  const thisMonth = videos.filter((video) => video.created_at >= startOfMonth);
  setNewlyAddedVideos(newlyAdded.slice(0, 4));
  setThisWeekVideos(thisWeek.slice(0, 4));
  setThisMonthVideos(thisMonth.slice(0, 4));
}

// Unit test
describe('filterVideos', () => {
  let setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos;

  beforeEach(() => {
    setNewlyAddedVideos = jest.fn();
    setThisWeekVideos = jest.fn();
    setThisMonthVideos = jest.fn();
  });

  it('memasukkan video hari ini ke newlyAdded', () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const videos = [
      { created_at: new Date(today) },
      { created_at: new Date(today.setDate(today.getDate() - 1)) }
    ];
    filterVideos(videos, setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos);
    expect(setNewlyAddedVideos).toHaveBeenCalledWith(expect.arrayContaining([videos[0]]));
  });

  it('memasukkan video minggu ini ke thisWeek', () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay() + 1); // Senin minggu ini
    const videos = [
      { created_at: new Date(thisWeek) },
      { created_at: new Date(today.setDate(today.getDate() - 8)) } // Minggu lalu
    ];
    filterVideos(videos, setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos);
    expect(setThisWeekVideos).toHaveBeenCalledWith(expect.arrayContaining([videos[0]]));
  });

  it('memasukkan video bulan ini ke thisMonth', () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 2);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    const videos = [
      { created_at: new Date(thisMonth) },
      { created_at: new Date(lastMonth) }
    ];
    filterVideos(videos, setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos);
    expect(setThisMonthVideos).toHaveBeenCalledWith(expect.arrayContaining([videos[0]]));
  });

  it('tidak error jika array kosong', () => {
    expect(() => filterVideos([], setNewlyAddedVideos, setThisWeekVideos, setThisMonthVideos)).not.toThrow();
    expect(setNewlyAddedVideos).toHaveBeenCalledWith([]);
    expect(setThisWeekVideos).toHaveBeenCalledWith([]);
    expect(setThisMonthVideos).toHaveBeenCalledWith([]);
  });
}); 
