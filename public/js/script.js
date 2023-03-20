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

prevButton.addEventListener("click", () => {
  // TODO: implement previous song functionality
});

nextButton.addEventListener("click", () => {
  // TODO: implement next song functionality
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
});

progressSlider.addEventListener("input", () => {
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (progressSlider.value / 100) * duration;
});

// TODO: add functionality to change song and update UI accordingly



/// list page

// {{#each tracks}}
// <tr >
//     <td id="id">{{@index}}</td>
//     <td><a href="#" id="list_play" onclick="play({{this.id}})">{{this.name}}</a></td>
//     <td>{{this.artist}}</td>
//     <td>{{this.album}}</td>
//     <td>{{this.duration}}</td>
// </tr>
// {{/each}}

document.querySelectorAll('#list_play').forEach(function(button) {
  button.addEventListener('click', function() {
    event.preventDefault();
      var trackId = this.getAttribute('data-track-id');
      console.log(trackId);
      fetch(`/track/${trackId}`)
      .then((response) =>
          response.json()
      )
      .then((track)=>{
          audioPlayer.src = track.preview_url;
          progressSlider.value = 0;
          audioPlayer.play();
          songNameSpan.textContent = track.name;
          playButton.innerHTML = '<i class="fas fa-pause"></i>';
          isPlaying = true;
      })
      .catch((error) => {
          console.error(error);
      });
  });
});


