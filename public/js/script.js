let audioPlayer = document.querySelector("#audio-player");


/// player

const playButton = document.querySelector("#play");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const muteButton = document.querySelector("#mute");
const volumeSlider = document.querySelector("#volume");
const progressSlider = document.querySelector("#progress");
const currentTimeSpan = document.querySelector(".current_time");
const totalTimeSpan = document.querySelector(".total_time");
const songNameSpan = document.querySelector(".name");

let isPlaying = false;
let isMuted = false;
let currentVolume = 1;
let savedVolume = localStorage.getItem("volume");
if (savedVolume === null) {
  currentVolume = 0.3;
} else {
  currentVolume = parseFloat(savedVolume);
}

audioPlayer.volume = currentVolume;
volumeSlider.value = currentVolume;


audioPlayer.addEventListener("loadedmetadata", () => {
  const duration = audioPlayer.duration;
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);

  totalTimeSpan.textContent = `${durationMinutes}:${durationSeconds}`;
});

audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const currentTimeMinutes = Math.floor(currentTime / 60);
  const currentTimeSeconds = Math.floor(currentTime % 60);
  const duration = audioPlayer.duration;

  if (!audioPlayer.paused && isFinite(duration)) {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    progressSlider.value = (currentTime / duration) * 100;
    currentTimeSpan.textContent = `${currentTimeMinutes}:${currentTimeSeconds}`;
    totalTimeSpan.textContent = `${durationMinutes}:${durationSeconds}`;
  }
});

playButton.addEventListener("click", () => {
  if (!isPlaying) {
    audioPlayer.play();
    isPlaying = true;
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audioPlayer.pause();
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
});


muteButton.addEventListener("click", () => {
  if (!isMuted) {
    currentVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    isMuted = true;
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeSlider.value = 0;
  } else {
    audioPlayer.volume = currentVolume;
    isMuted = false;
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeSlider.value = currentVolume;
  }
});

volumeSlider.addEventListener("input", () => {
  currentVolume = volumeSlider.value;
  audioPlayer.volume = currentVolume;
  localStorage.setItem("volume", currentVolume.toString());
});

progressSlider.addEventListener("input", () => {
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (progressSlider.value / 100) * duration;
});


// for playing the song on click of the song name
document.querySelectorAll('#list_play').forEach(function (button) {
  button.addEventListener('click', function () {
    event.preventDefault();
    var trackId = this.getAttribute('data-track-id');
    console.log(trackId);
    fetch(`/track/${trackId}`)
      .then((response) => response.json())
      .then((track) => {
        audioPlayer.src = track.preview_url;
        progressSlider.value = 0;
        audioPlayer.play();
        songNameSpan.textContent = track.name;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        audioPlayer.dataset.trackId = track.id;
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

$(document).ready(function () {
  var playlist = [];
  $('#playlist-table-body tbody tr').each(function (index, element) {
    var song = {};
    song.id = $(element).find('#song-id').text();
    song.name = $(element).find('td:nth-child(2)').text();
    song.artist = $(element).find('td:nth-child(3)').text();
    song.duration = $(element).find('td:nth-child(5)').text();
    song.preview_url = $(element).find('td:nth-child(6) audio').attr('src');

    playlist.push(song);
  });

  prevButton.addEventListener("click", () => {
    const currentIndex = playlist.findIndex(song => song.id === audioPlayer.dataset.trackId);
    const prevIndex = (currentIndex === 0) ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    fetch(`/track/${prevSong.id}`)
      .then((response) => response.json())
      .then((track) => {
        audioPlayer.src = track.preview_url;
        progressSlider.value = 0;
        audioPlayer.play();
        songNameSpan.textContent = track.name;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        audioPlayer.dataset.trackId = track.id;
      })
      .catch((error) => {
        console.error(error);
        // If there was an error fetching the previous track, try playing the last track in the playlist
        const lastSong = playlist[playlist.length - 1];
        audioPlayer.src = lastSong.preview_url;
        progressSlider.value = 0;
        audioPlayer.play();
        songNameSpan.textContent = lastSong.name;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        audioPlayer.dataset.trackId = lastSong.id;
      });
  });


  nextButton.addEventListener("click", () => {
    const currentIndex = playlist.findIndex(song => song.id === audioPlayer.dataset.trackId);
    const nextIndex = (currentIndex === playlist.length - 1) ? 0 : currentIndex + 1;
    const nextSong = playlist[nextIndex];
    fetch(`/track/${nextSong.id}`)
      .then((response) => response.json())
      .then((track) => {
        if (track.preview_url) { // check if track has a preview_url
          audioPlayer.src = track.preview_url;
          progressSlider.value = 0;
          audioPlayer.play();
          songNameSpan.textContent = track.name;
          playButton.innerHTML = '<i class="fas fa-pause"></i>';
          isPlaying = true;
          audioPlayer.dataset.trackId = track.id;
        } else {
          // If no preview_url found, play the next song in the list
          if (audioPlayer.dataset.trackId) {
            const currentSong = playlist.find(song => song.id === audioPlayer.dataset.trackId);
            const currentSongIndex = playlist.findIndex(song => song.id === audioPlayer.dataset.trackId);
            const nextSongIndex = (currentSongIndex === playlist.length - 1) ? 0 : currentSongIndex + 1;
            const nextSong = playlist[nextSongIndex];
            fetch(`/track/${nextSong.id}`)
              .then((response) => response.json())
              .then((track) => {
                audioPlayer.src = track.preview_url;
                progressSlider.value = 0;
                audioPlayer.play();
                songNameSpan.textContent = track.name;
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
                audioPlayer.dataset.trackId = track.id;
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            // If no track is currently playing, play the first song in the list
            const firstSong = playlist[0];
            fetch(`/track/${firstSong.id}`)
              .then((response) => response.json())
              .then((track) => {
                audioPlayer.src = track.preview_url;
                progressSlider.value = 0;
                audioPlayer.play();
                songNameSpan.textContent = track.name;
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
                audioPlayer.dataset.trackId = track.id;
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
