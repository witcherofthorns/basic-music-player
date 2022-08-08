const audio_player = document.createElement('audio');
const table_list = document.getElementById('audio-list')
const play_pause = document.getElementById('play');
const info_block = document.querySelector('.info')
const screen = document.querySelector('.screen')
const slider = document.querySelector('.seek_slider')
const info_track_cover = document.querySelector('.coverImage')
const body = document.body
const info_track_name = info_block.childNodes[1]
const info_track_author = info_block.childNodes[3]

let audioIndex = 0
let sliderValue = 0
let updateSliderTimer;


const trackList = [
   {
      Author: 'Jameson Nathan Jones',
      Title: 'all things repeat',
      Cover: 'cover_3.jpg',
      CoverBg: 'bg_3.jpg',
      Mp3: 'audio/all_things_repeate.mp3',
      Lenght: '3:39'
   },
   {
      Author: 'LORN',
      Title: 'Anvil',
      Cover: 'cover_4.jpg',
      CoverBg: 'bg_4.jpg',
      Mp3: 'audio/lorn_anvil.mp3',
      Lenght: '3:41'
   },
   {
      Author: 'Daniel James Taylor',
      Title: 'Factorio Trailer OST',
      Cover: 'cover_5.jpg',
      CoverBg: 'bg_5.jpg',
      Mp3: 'audio/factorio_gameplay_trailer.mp3',
      Lenght: '2:22'
   }
]



function createAudioListObject(AudioObject, audio_index) {
   let audio_index_view = (audio_index + 1)
   let element = document.createElement('tr')
   element.className = 'song'
   element.innerHTML = `
   <td class="nr"><h5>${audio_index_view}<h5></td>
   <td class="title" onclick="PlayTrack(${audio_index})"><h6>${AudioObject.Title}<h6></td>
   <td class="length"><h5>${AudioObject.Lenght}<h5></td>`
   return element
}

function createAudioList() {
   let iter = 0
   for(let track of trackList)
   {
      table_list.appendChild(createAudioListObject(track, iter++))
   }
}

function PlayTrack(index) {
   audio_index = index
   setPlayTrack(index)
}

function setPreviewTrack() {
   info_track_name.textContent = trackList[audioIndex].Title
   info_track_author.textContent = trackList[audioIndex].Author

   info_track_cover.style["transition"] = "all 0.3s ease-in"
   info_track_cover.style.background = `url(imgs/${trackList[audioIndex].Cover})`
   info_track_cover.style["background-repeat"] = "no-repeat"
   info_track_cover.style["background-position"] = "center center"
   info_track_cover.style["background-size"] = "cover"
   

   body.style.background = `url(imgs/${trackList[audioIndex].CoverBg}) 0% 0% / 300em`
   body.style["background-size"] = "cover"
}

function setPreloadTrack() {
   audio_player.src = trackList[audioIndex].Mp3
   audio_player.load()
   audio_player.removeEventListener("ended",setPlayNextTrack)
   audio_player.addEventListener("ended", setPlayNextTrack);
}

function setPlayTrack(index) {
   audioIndex = index
   setPreloadTrack()
   setPreviewTrack()
   togglePlayRefresh(true)
   audio_player.onLoadedAudio = onLoadedAudio()
}

function setPlayLastTrack() {
   if ((audioIndex - 1) >= 0) {
      audioIndex -= 1;
   } else {
      audioIndex = 0;
   }
   setPlayTrack(audioIndex)
}

function setPlayNextTrack() {
   if (audioIndex < trackList.length - 1) {
      audioIndex += 1;
      setPlayTrack(audioIndex)
   }
   else {
      audioIndex = 0;
      audio_player.pause()
      setPreloadTrack()
      setPreviewTrack()
      togglePlayRefresh(false)
      resetSeekSlider()
   }
}

function resetSeekSlider() {
   slider.style["background-size"] = "0% 100%"
   sliderValue = 0
}

function updateSeekSlider() {
   if(audio_player.paused) {
      return
   }

   slider.style["background-size"] = `${sliderValue}% 100%`
   sliderValue = audio_player.currentTime * (100 / audio_player.duration);
}

function togglePlayRefresh(value) {
   play_pause.checked = false
   setTimeout(() =>{
      play_pause.checked = value
   }, 500)
}

function togglePlayPause() {
   if(!audio_player.readyState) {
      if(trackList.length == 0){
         console.error('Error! Audio list is empty!')
         return
      }
      setPlayTrack(0)
      return
   }

   if (audio_player.paused || audio_player.ended) {
      play_pause.title = "Pause";
      audio_player.play();
   } else {
      play_pause.title = "Play";
      audio_player.pause();
   }
}

function onLoadedAudio() {
   audio_player.play()
   resetSeekSlider()
   clearInterval(updateSliderTimer)
   updateSliderTimer = setInterval(updateSeekSlider, 1000)
}

createAudioList()