const playButton = document.querySelector(".playButton__play")
//const playButtonIcon = document.querySelector("#playButtonIcon")
const waveform = document.querySelector(".waveform")
const volumeIcon = document.querySelector("#volumeIcon")
const volumeSlider = document.querySelector("#volumeSlider")
const currentTime = document.querySelector("#currentTime")
const totalDuration = document.querySelector("#totalDuration")
// --------------------------------------------------------- //
/**
 * Initialize Wavesurfer
 * @returns a new Wavesurfer instance
 */
const initializeWavesurfer = () => {
  return WaveSurfer.create({
    container: ".waveform",
    responsive: true,
    height: 80,
    waveColor: "#ff5501",
    progressColor: "#d44700",
    barWidth: 4,
  })
}
// --------------------------------------------------------- //
// Functions
/**
 * Toggle play button
 */
/*const togglePlay = (idplayer,num) => {
  console.log(idplayer)
  var pauses= document.getElementById("iconPause"+num)
  var element = document.getElementById("iconPlay"+num)
  var item_val = element.classList.item(1);
  Spectrum.playPause()
  const isPlaying = Spectrum.isPlaying()
  if (isPlaying) {
    //playButtonIcon.src = "assets/icons/pause.svg"
    element.classList.remove("fa-play");
    element.setAttribute('style', 'display:none');
    pauses.removeAttribute('style');
    element.classList.add("fa-pause");
  } else {
   // playButtonIcon.src = "assets/icons/play.svg"
   element.classList.remove("fa-pause");
   element.classList.add("fa-play");
   element.removeAttribute('style');
   pauses.setAttribute('style','display:none');
  }
}*/

/*function togglePlay() {
  if (player.paused) {
    toggleIcon();
    return player.play();
  } else {

    toggleIcon();
    return player.pause();
  }
}
function toggleIcon() {
  var element = document.getElementById("iconPlay")
  var item_val = element.classList.item(1);
  //console.log(item_val);
  if (item_val === "fa-pause") {
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");

  } else {
    element.classList.remove("fa-play");
    element.classList.add("fa-pause");
    //console.log(item_val);
  }
}*/
/**
 * Handles changing the volume slider input
 * @param {event} e
 */
const handleVolumeChange = e => {
  // Set volume as input value divided by 100
  // NB: Wavesurfer only excepts volume value between 0 - 1
  const volume = e.target.value / 100
  wavesurfer.setVolume(volume)
  // Save the value to local storage so it persists between page reloads
  localStorage.setItem("audio-player-volume", volume)
}
/**
 * Retrieves the volume value from local storage and sets the volume slider
 */
/*const setVolumeFromLocalStorage = () => {
  // Retrieves the volume from local storage, or falls back to default value of 50
  const volume = localStorage.getItem("audio-player-volume") * 100 || 50
  volumeSlider.value = volume
}*/
/**
 * Formats time as HH:MM:SS
 * @param {number} seconds
 * @returns time as HH:MM:SS
 */
const formatTimecode = seconds => {
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}
/**
 * Toggles mute/unmute of the Wavesurfer volume
 * Also changes the volume icon and disables the volume slider
 */
const toggleMute = () => {
  wavesurfer.toggleMute()
  const isMuted = wavesurfer.getMute()
  if (isMuted) {
    volumeIcon.src = "assets/icons/mute.svg"
    volumeSlider.disabled = true
  } else {
    volumeSlider.disabled = false
    volumeIcon.src = "assets/icons/volume.svg"
  }
}
// --------------------------------------------------------- //
// Create a new instance and load the wavesurfer
const wavesurfer = initializeWavesurfer()
//wavesurfer.load("/assets/uploads/prueba.mp3")
// --------------------------------------------------------- //
// Javascript Event listeners
/*window.addEventListener("load", setVolumeFromLocalStorage)*/
//playButton.addEventListener("click", togglePlay)
//volumeIcon.addEventListener("click", toggleMute)
//volumeSlider.addEventListener("input", handleVolumeChange)
// --------------------------------------------------------- //
// Wavesurfer event listeners
wavesurfer.on("ready", () => {
  // Set wavesurfer volume
  wavesurfer.setVolume(volumeSlider.value / 100)
  // Set audio track total duration
  const duration = wavesurfer.getDuration()
  //totalDuration.innerHTML = formatTimecode(duration)
})
// Sets the timecode current timestamp as audio plays
wavesurfer.on("audioprocess", () => {
  const time = wavesurfer.getCurrentTime()
  currentTime.innerHTML = formatTimecode(time)
})
// Resets the play button icon after audio ends
wavesurfer.on("finish", () => {
  playButtonIcon.src = "assets/icons/play.svg"
})