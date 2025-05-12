<script setup lang="ts">
import DrumCell from '@/components/DrumCell.vue'
import SynthCell from '@/components/SynthCell.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
import { handleInstReset, handleChangeWave, toggleIsActive } from '@/utils/track.ts'
import { usePlayer } from '@/Hooks/UsePlayer.ts'
import NameForm from '@/components/NameForm.vue'
import KeyCell from '@/components/KeyCell.vue'
import SynthGrid from '@/components/SynthGrid.vue'

const route = useRoute()
const id = route.params.id

const track = ref<Track>(defaultTrack)

const trackName = computed(() => track.value.name)

const handleSetupData = async () => {
  if (!id) return
  track.value = await getTrack(Number(id))
}

const handleSynthToggleIsActive = (i: number, x: number) => {
  toggleIsActive(i, x, track.value.instruments.synth.pattern)
}

const { start, stop, isPlaying, currentStep, inst } = usePlayer()
const { bass, piano } = inst

const saveTrack = async (name: string) => {
  track.value.name = name
  const { id, ...otherProps } = track.value

  if (id) {
    await updateTrack(track.value)
  } else {
    await createTrack(otherProps)
  }

  if (isPlaying.value) {
    stop()
  }
  router.push({ name: 'list' })
}

onMounted(() => {
  handleSetupData()
})

onUnmounted(() => {
  handleInstReset(track.value, true, true, true)
})
</script>

<template>
  <div class="container">
    <h2>プロジェクト</h2>
    <div class="grid-container">
      PIANO
      <div>
        <select
          v-model="track.instruments.synth.waveType"
          @change="handleChangeWave($event, piano, 'synth', track)"
        >
          <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div>
        <SynthGrid
          :pattern="track.instruments.synth.pattern"
          :current-step="currentStep"
          :is-playing="isPlaying"
          :tone="piano"
          :wave-type="track.instruments.synth.waveType"
          :handle-toggle-is-active="handleSynthToggleIsActive"
        />
      </div>
    </div>
    <div class="grid-container">
      Bass
      <div>
        <select
          v-model="track.instruments.bass.waveType"
          @change="handleChangeWave($event, bass, 'bass', track)"
        >
          <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div v-for="(item, i) of track.instruments.bass.pattern" :key="i" class="row-container">
        <div v-for="(cell, x) of item" :key="x">
          <SynthCell
            :note="bassNotes.slice().reverse()[i]"
            :is-active="cell === 1"
            :is-current-step="x === currentStep"
            :is-playing="isPlaying"
            :tone="bass"
            :wave-type="track.instruments.bass.waveType"
            @toggle-is-active="toggleIsActive(i, x, track.instruments.bass.pattern)"
          />
        </div>
      </div>
    </div>

    <div class="grid-container">
      DRUM
      <div v-for="(item, i) of track.instruments.drums.pattern" :key="i" class="row-container">
        <div v-for="(cell, x) of item" :key="x">
          <DrumCell
            :path="soundsPath[i]"
            :is-active="cell === 1"
            :is-current-step="x === currentStep"
            :is-playing="isPlaying"
            @toggle-is-active="toggleIsActive(i, x, track.instruments.drums.pattern)"
          />
        </div>
      </div>
    </div>
    <div class="menu-container">
      <div @click="start(track)">start</div>
      <div @click="stop">stop</div>
    </div>
    <div @click="handleInstReset(track, true, true, true)">all reset</div>
  </div>
  <NameForm :name="trackName" @save="saveTrack" />
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
