<script setup lang="ts">
import * as Tone from 'tone'
import { ref, onMounted, type Ref } from 'vue'
import router from '@/router'
import { getAllTracks } from '@/Hooks/UseTracks.ts'
import { bassNotes, pianoNotes, soundsPath, type Track } from '@/constants/track.ts'

const tracks = ref<Track[]>([])

const currentStep = ref(0)
const isPlaying = ref(false)
const playingListIndex: Ref<null | number> = ref(null)

const piano = new Tone.PolySynth().toDestination()
const bass = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sawtooth' } }).toDestination()
const kick = new Tone.Player().toDestination()
const snare = new Tone.Player().toDestination()
const hat = new Tone.Player().toDestination()
const shaker = new Tone.Player().toDestination()
const crash = new Tone.Player().toDestination()

const start = async (data: Track, index: number) => {
  playingListIndex.value = index
  if (isPlaying.value) {
    stop()
  }

  isPlaying.value = true
  // Tone.context が開始されていなければ最初に開始
  await Tone.start()

  await kick.load(soundsPath[4])

  await snare.load(soundsPath[3])

  await hat.load(soundsPath[2])

  await shaker.load(soundsPath[1])

  await crash.load(soundsPath[0])

  const exeList = [
    (time: number) => {
      crash.start(time)
    },
    (time: number) => {
      shaker.start(time)
    },
    (time: number) => {
      hat.start(time)
    },
    (time: number) => {
      snare.start(time)
    },
    (time: number) => {
      kick.start(time)
    },
  ]

  // 2回目以降リセットされないので 既存のスケジュールを全部クリア
  Tone.Transport.cancel()

  Tone.Transport.loop = true
  Tone.Transport.loopEnd = '2m'

  Tone.Transport.scheduleRepeat((time) => {
    data.pattern.drums.forEach((row, rowIndex) => {
      if (row[currentStep.value] === 1) {
        exeList[rowIndex](time)
      }
    })

    // piano
    data.pattern.synth.forEach((row, rowIndex) => {
      if (row[currentStep.value] === 1) {
        piano.triggerAttackRelease(pianoNotes.slice().reverse()[rowIndex], '16n', time)
      }
    })

    // bass

    data.pattern.bass.forEach((row, rowIndex) => {
      if (row[currentStep.value] === 1) {
        bass.triggerAttackRelease(bassNotes.slice().reverse()[rowIndex], '16n', time)
      }
    })
    currentStep.value = (currentStep.value + 1) % 32
  }, '16n')

  Tone.Transport.start()
}

const stop = () => {
  isPlaying.value = false
  Tone.Transport.stop()
  currentStep.value = 0
}

// 一覧
const fetchTracks = async () => {
  const res = await getAllTracks()
  tracks.value = res
}

const deleteTrack = async (id: number) => {
  await deleteTrack(id)
  tracks.value = tracks.value.filter((track) => track.id !== id)
}

const handleUpdate = (id: number) => {
  if (isPlaying.value) {
    stop()
  }
  router.push({ name: 'update', params: { id } })
}

onMounted(() => {
  fetchTracks()
})
</script>

<template>
  <div class="track-manager">
    <div class="track-list">
      <h2>保存した曲一覧</h2>
      <div v-for="(track, index) in tracks" :key="track.id" class="track-item">
        <span>名前: {{ track.name }}</span>
        <button @click="stop" v-if="isPlaying && playingListIndex === index">⏹️</button>
        <button @click="start(track, index)" v-else>▶️</button>
        <div @click="handleUpdate(track.id as number)">編集</div>
        <div @click="deleteTrack(track.id as number)">削除</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.track-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: white;
}

button[onclick*='delete'] {
  background-color: #f44336;
}

button[onclick*='delete']:hover {
  background-color: #da190b;
}
</style>
