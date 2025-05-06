<script setup lang="ts">
import DrumCell from '@/components/DrumCell.vue'
import * as Tone from 'tone'
import SynthCell from '@/components/SynthCell.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { createTrack, getTrack, updateTrack } from '@/Hooks/UseTracks.ts'
import {
  bassNotes,
  defaultTrack,
  pianoNotes,
  selectWaveItems,
  soundsPath,
  type Track,
} from '@/constants/track.ts'
import { handleAllReset, handleChangeWave, handleToggleIsActive } from '@/utils/track.ts'

const route = useRoute()
const id = route.params.id

const track = ref<Track>(defaultTrack)

const handleSetupData = async () => {
  if (!id) return
  track.value = await getTrack(Number(id))
}

const currentStep = ref(0)
const isPlaying = ref(false)

const piano = new Tone.PolySynth().toDestination()
const bass = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sawtooth' } }).toDestination()
const kick = new Tone.Player().toDestination()
const snare = new Tone.Player().toDestination()
const hat = new Tone.Player().toDestination()
const shaker = new Tone.Player().toDestination()
const crash = new Tone.Player().toDestination()

const start = async () => {
  isPlaying.value = true

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
    track.value.pattern.drums.forEach((row, rowIndex) => {
      if (row[currentStep.value] === 1) {
        exeList[rowIndex](time)
      }
    })

    // piano

    track.value.pattern.synth.forEach((row, rowIndex) => {
      if (row[currentStep.value] === 1) {
        piano.triggerAttackRelease(pianoNotes.slice().reverse()[rowIndex], '16n', time)
      }
    })

    // bass

    track.value.pattern.bass.forEach((row, rowIndex) => {
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

const saveTrack = async () => {
  const { id, ...otherProps } = track.value

  if (id) {
    await createTrack(track.value)
  } else {
    await updateTrack(otherProps)
  }

  if (isPlaying.value) {
    stop()
  }
  router.push({ name: 'list' })
}

onMounted(() => {
  handleSetupData()
})
</script>

<template>
  <div class="container">
    <h2>プロジェクト</h2>
    <div class="grid-container">
      PIANO
      <div>
        <select @change="handleChangeWave($event, piano)">
          <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div v-for="(item, i) of track.pattern.synth" :key="i" class="row-container">
        <div v-for="(cell, x) of item" :key="x">
          <SynthCell
            :note="pianoNotes.slice().reverse()[i]"
            :is-active="cell === 1"
            :is-current-step="x === currentStep"
            :is-playing="isPlaying"
            :tone="piano"
            @toggle-is-active="handleToggleIsActive(i, x, track.pattern.synth)"
          />
        </div>
      </div>
    </div>

    <div class="grid-container">
      Bass
      <div>
        <select @change="handleChangeWave($event, bass)">
          <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div v-for="(item, i) of track.pattern.bass" :key="i" class="row-container">
        <div v-for="(cell, x) of item" :key="x">
          <SynthCell
            :note="bassNotes.slice().reverse()[i]"
            :is-active="cell === 1"
            :is-current-step="x === currentStep"
            :is-playing="isPlaying"
            :tone="bass"
            @toggle-is-active="handleToggleIsActive(i, x, track.pattern.bass)"
          />
        </div>
      </div>
    </div>

    <div class="grid-container">
      DRUM
      <div v-for="(item, i) of track.pattern.drums" :key="i" class="row-container">
        <div v-for="(cell, x) of item" :key="x">
          <DrumCell
            :path="soundsPath[i]"
            :is-active="cell === 1"
            :is-current-step="x === currentStep"
            :is-playling="isPlaying"
            @toggle-is-active="handleToggleIsActive(i, x, track.pattern.drums)"
          />
        </div>
      </div>
    </div>
    <div class="menu-container">
      <div @click="start">start</div>
      <div @click="stop">stop</div>
    </div>
    <div @click="handleAllReset(track.pattern)">all reset</div>
  </div>

  <div class="save-form">
    <input v-model="track.name" placeholder="名前" />
    <button @click="saveTrack">保存</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.menu-container {
  display: flex;
  gap: 4px;
}
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.row-container {
  display: flex;
  gap: 4px;
}

.save-form {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.save-form input {
  margin-right: 10px;
  padding: 5px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button[onclick*='delete'] {
  background-color: #f44336;
}

button[onclick*='delete']:hover {
  background-color: #da190b;
}
</style>
