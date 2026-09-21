// Verified Working Audio Streams (CDN & Public Web Audio)
const songs = [
 {
    id: 0,
    title: "A Child's Prayer",
    artist: "Zain Bhikha",
    category: "Remembrance",
    cover:"cover.png",
    src: "Zain Bhikha_ A Child's Prayer.mp3" // Local Working File
  },
  {
    id: 1,
    title: "Beloved Nabi",
    artist: "Talib Al Habib",
    category: "Naat",
    cover: "cover2.png",
    src: "Beloved Nabi.mp3" // Local File
  },
  {
    id: 2,
    title: "Nasheed Track",
    artist: "Artist Name",
    category: "Nasheed",
    cover: "cover3.png",
    src: "Nasheed.mp3"
  },
  {
    id: 3,
    title: "Wedding Song",
    artist: "Zain Bhikha",
    category: "Wedding",
    cover: "cover3.png",
    src: "Wedding Song.mp3"
  },
  {
    id: 4,
    title: "Mum and Dad",
    artist: "Zain Bhikha",
    category: "Nasheed",
    cover: "cover3.png",
    src: "MumAndDad.mp3"
  },
   {
    id: 5,
    title: "Oh Lord",
    artist: "Zain Bhikha",
    category: "Hamad",
    cover: "cover1.png",
    src: "Hamad.mp3"
  },
  {
    id: 6,
    title: "Zikar-Allah",
    artist: "Talib-al-Habib",
    category: "Remembrance",
    cover: "cover.png",
    src: "Hamad2.mp3"
  },
 {
    id: 7,
    title: "Make-Me-Strong",
    artist: "Talib-al-Habib",
    category: "Hamad",
    cover: "cover1.png",
    src: "MAKE ME STRONG.mp3"
  },
    {
    id: 8,
    title: "Peace-be-Upon-Muhammad",
    artist: "Salah-Alhashim",
    category: "Naat",
    cover: "cover2.png",
    src: "Peace Be Upon Muhammad.mp3"
  },
  {
    id: 9,
    title: "Sleeding to Paradise",
    artist: "Talib Al Habib",
    category: "Hamad",
    cover: "cover1.png",
    src: "Hamad3.mp3"
  },
  
];

// DOM Elements
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const coverArt = document.getElementById("coverArt");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackCategory = document.getElementById("trackCategory");

const playlistEl = document.getElementById("playlist");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// State Variables
let currentSongIndex = 0;
let isPlaying = false;
let filteredSongs = [...songs];

// Initialize Player
function loadSong(song) {
  if (!song) return;
  trackTitle.innerText = song.title;
  trackArtist.innerText = song.artist;
  trackCategory.innerText = song.category;
  coverArt.src = song.cover;
  audio.src = song.src;
  updatePlaylistHighlight();
}

function renderPlaylist(songsToRender) {
  playlistEl.innerHTML = "";
  if (!songsToRender || songsToRender.length === 0) {
    playlistEl.innerHTML = `<li style="cursor:default; padding: 10px;">No songs found</li>`;
    return;
  }

  songsToRender.forEach((song) => {
    const li = document.createElement("li");
    li.dataset.id = song.id;
    if (songs[currentSongIndex] && songs[currentSongIndex].id === song.id) {
      li.classList.add("active");
    }

    li.innerHTML = `
      <div class="song-info">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
      <span class="badge">${song.category}</span>
    `;

    li.addEventListener("click", () => {
      const selectedIndex = songs.findIndex(s => s.id === song.id);
      if (selectedIndex !== -1) {
        currentSongIndex = selectedIndex;
        loadSong(songs[currentSongIndex]);
        playSong();
      }
    });

    playlistEl.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach(item => {
    if (songs[currentSongIndex] && parseInt(item.dataset.id) === songs[currentSongIndex].id) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Play & Pause
function playSong() {
  isPlaying = true;
  playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  audio.play().catch(err => {
    console.log("Playback blocked or link error:", err);
  });
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  audio.pause();
}

playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Next & Previous
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Progress Bar & Duration
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;

    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationEl.innerText = formatTime(audio.duration);
  }
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Volume Control
volumeBar.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

// Auto-play Next Song when Finished
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Search and Category Filter Logic
function filterSongs() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm) || 
                          song.artist.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || song.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  renderPlaylist(filteredSongs);
}

searchInput.addEventListener("input", filterSongs);
categoryFilter.addEventListener("change", filterSongs);

// Initial Load
loadSong(songs[currentSongIndex]);
renderPlaylist(songs);