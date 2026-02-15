let songs = [];
let currentIndex = 0;

const songList = document.getElementById("songList");
const modal = document.getElementById("playerModal");
const audio = document.getElementById("audioPlayer");
const modalSongName = document.getElementById("modalSongName");
const playIcon = document.getElementById("playIcon");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volumeBar = document.getElementById("volumeBar");
const loader = document.getElementById("loader");

audio.volume = 1;

/* Fetch Songs */
async function fetchSongs(){
  loader.style.display="flex";
  songList.style.display="none";

  const res = await fetch("http://localhost:5000/songs");
  songs = await res.json();

  loader.style.display="none";
  songList.style.display="block";

  displaySongs();
}

/* Display Songs */
function displaySongs(){
  songList.innerHTML="";

  songs.forEach((song,index)=>{
    const row=document.createElement("div");
    row.className="song-row";

    row.innerHTML=`
      <div class="song-left">
        <i class="fa-solid fa-music"></i>
        <span>${song.name}</span>
      </div>

      <button class="song-play"
        onclick="event.stopPropagation(); openModal(${index})">
        <i class="fa-solid fa-play"></i>
      </button>
    `;

    row.onclick=()=>openModal(index);
    songList.appendChild(row);
  });
}

/* Player */
function openModal(index){
  currentIndex=index;
  modal.style.display="block";
  playSong(index);
}

function closeModal(){
  modal.style.display="none";
  audio.pause();
  playIcon.classList.replace("fa-pause","fa-play");
}

function playSong(index){
  audio.src=songs[index].url;
  modalSongName.innerText=songs[index].name;
  audio.play();
  playIcon.classList.replace("fa-play","fa-pause");
}

function playPause(){
  if(audio.paused){
    audio.play();
    playIcon.classList.replace("fa-play","fa-pause");
  }else{
    audio.pause();
    playIcon.classList.replace("fa-pause","fa-play");
  }
}

function nextSong(){
  currentIndex=(currentIndex+1)%songs.length;
  playSong(currentIndex);
}

function prevSong(){
  currentIndex=(currentIndex-1+songs.length)%songs.length;
  playSong(currentIndex);
}

/* Time */
function formatTime(sec){
  let m=Math.floor(sec/60);
  let s=Math.floor(sec%60);
  return `${m}:${s<10?"0":""}${s}`;
}

audio.addEventListener("loadedmetadata",()=>{
  durationEl.innerText=formatTime(audio.duration);
});

audio.addEventListener("timeupdate",()=>{
  progressBar.value=(audio.currentTime/audio.duration)*100;
  currentTimeEl.innerText=formatTime(audio.currentTime);
});

progressBar.addEventListener("input",()=>{
  audio.currentTime=(progressBar.value/100)*audio.duration;
});

/* Volume */
volumeBar.addEventListener("input",()=>{
  audio.volume=volumeBar.value;
});

/* Init */
fetchSongs();