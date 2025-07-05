<template>
  <div class="app" @click="unlockAudio">
    <div class="overlay">
      <h1 class="title">G14 Project testing</h1>
      <h2 class="title">by NON-STOP NYAN CAT</h2>

      <div class="nyan-container">
        <img
          src="https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif"
          alt="Nyan Cat"
          class="nyan-gif"
        />
      </div>

      <audio ref="nyanAudio" :src="audioSrc" loop></audio>

      <button v-if="!isPlaying" class="audio-button" @click.stop="playAudio">
        ▶ Click to Play Music
      </button>
      <button v-else class="audio-button" @click.stop="pauseAudio">
        ⏸ Pause Music
      </button>

      <div class="timer">
        You've nyaned for <strong>{{ elapsed.toFixed(1) }}</strong> seconds
      </div>

      <!-- ข้อความอัพเดต พร้อมจุด animation -->
      <div class="updating">
        Updating soon<span class="dots"></span>       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
const elapsed = ref(0)
const audioSrc = 'https://ia800905.us.archive.org/17/items/nyannyannyan/NyanCatoriginal.mp3'
const nyanAudio = ref(null)
let intervalId = null

const playAudio = async () => {
  try {
    await nyanAudio.value.play()
    isPlaying.value = true
  } catch (err) {
    console.warn('Autoplay failed:', err)
  }
}

const pauseAudio = () => {
  nyanAudio.value.pause()
  isPlaying.value = false
}

const unlockAudio = async () => {
  if (!isPlaying.value) {
    await playAudio()
  }
}

onMounted(() => {
  playAudio()
  intervalId = setInterval(() => {
    elapsed.value += 0.1
  }, 100)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* 💡 Reset scrolling & padding on base elements */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* 🧱 Fixed full-screen background */
.app {
  position: fixed;
  inset: 0;
  background: linear-gradient(to bottom right, #003b88, #0851b5);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🎨 Inner content */
.overlay {
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  color: white;
  max-width: 90vw;
  padding: 2rem;
  box-sizing: border-box;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.nyan-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.nyan-gif {
  border: 4px solid black;
  border-radius: 10px;
  max-width: 100%;
  height: auto;
}

.audio-button {
  background: #222;
  border: 2px solid #fff;
  color: white;
  padding: 10px 20px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}

.audio-button:hover {
  background: #444;
}

.timer {
  margin-top: 1.2rem;
  font-size: 0.7rem;
}

/* สไตล์สำหรับข้อความ updating */
.updating {
  margin-top: 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 1px;
  /* position: relative; */
}

/* animation จุด 3 จุดแบบไล่ทีละจุด */
.dots::after {
  content: '';
  animation: dotsTyping 3s steps(3, end) infinite;
  display: inline-block;
  width: 1.2em;
  text-align: left;
  color: white;
}

@keyframes dotsTyping {
  0% {
    content: '';
  }
  33% {
    content: '.';
  }
  66% {
    content: '..';
  }
  100% {
    content: '...';
  }
}

</style>
