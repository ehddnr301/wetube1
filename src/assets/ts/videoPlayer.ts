import getBlobDuration from "get-blob-duration";
import { goFull, exitFull, formatDate } from "./utils";
const videoContainer = document.getElementById("jsVideoPlayer") as MYDivElement;
const videoPlayer = document.querySelector(
  "#jsVideoPlayer video"
) as HTMLVideoElement;
const playBtn = document.getElementById("jsPlayButton") as HTMLSpanElement;
const volumeBtn = document.getElementById("jsVolumeBtn") as HTMLSpanElement;
const fullScrnBtn = document.getElementById("jsFullScreen") as HTMLSpanElement;
const currentTime = document.getElementById("currentTime") as HTMLSpanElement;
const totalTime = document.getElementById("totalTime") as HTMLSpanElement;
const volumeRange = document.getElementById("jsVolume") as HTMLInputElement;

interface MYDivElement extends HTMLDivElement {
  webkitRequestFullscreen?: any;
  mozRequestFullScreen?: any;
  msRequestFullscreen?: any;
}

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST"
  });
};

function handlePlayClick(): void {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick(): void {
  if (videoPlayer.muted) {
    console.log(videoPlayer.volume);
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume.toString();
  } else {
    volumeRange.value = "0";
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScreen() {
  videoPlayer.style.width = "850px";
  const document: any = window.document;
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  exitFull();
}

function goFullScreen() {
  videoPlayer.style.width = "100%";
  videoContainer.webkitRequestFullscreen();
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
  goFull();
}

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

async function setTotalTime() {
  const blob = await fetch(videoPlayer.src).then(response => response.blob());
  const duration = await getBlobDuration(blob);
  const totalTimeString = formatDate(duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event: any) {
  const {
    target: { value }
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
  init();
  setTotalTime();
}
