<script setup lang="ts">
import DrumCell from '@/components/DrumCell.vue'
import SynthCell from '@/components/SynthCell.vue'
import {ref, onMounted, onUnmounted} from 'vue'
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
import { usePlayer } from '@/Hooks/UsePlayer.ts'

const route = useRoute()
const id = route.params.id

const track = ref<Track>(defaultTrack)

const handleSetupData = async () => {
  if (!id) return
  track.value = await getTrack(Number(id))
}

const { start, stop, isPlaying, currentStep, inst } = usePlayer()
const { bass, piano } = inst

const saveTrack = async () => {
  const { id, ...otherProps } = track.value

  if (id) {
    await updateTrack(otherProps)
  } else {
    await createTrack(track.value)
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
  handleAllReset(track.value.pattern)
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
      <div @click="start(track)">start</div>
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
