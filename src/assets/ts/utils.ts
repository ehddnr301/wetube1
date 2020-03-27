const videoContainer = document.getElementById("jsVideoPlayer") as MYDivElement;
interface MYDivElement extends HTMLDivElement {
  webkitRequestFullscreen?: any;
  mozRequestFullScreen?: any;
  msRequestFullscreen?: any;
}
export const exitFull = () => {
  const document: any = window.document;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

export const goFull = () => {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
};

export const formatDate = (seconds): any => {
  const secondsNumber = parseInt(seconds, 10);
  let hours: any = Math.floor(secondsNumber / 3600);
  let minutes: any = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds: any = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }

  return `${hours}:${minutes}:${totalSeconds}`;
};
