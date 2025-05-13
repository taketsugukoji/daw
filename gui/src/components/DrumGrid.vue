<script setup lang="ts">
import { drumTypeLabel, soundsPath } from '@/constants/track.ts'
import { toggleIsActive } from '@/utils/track.ts'
import DrumCell from '@/components/DrumCell.vue'

defineProps<{
  pattern: number[][]
  currentStep: number
  isPlaying: boolean
}>()
</script>

<template>
  <div v-for="(item, i) of pattern" :key="i" class="row-container">
    <div class="drum-type">{{ drumTypeLabel[i] }}</div>
    <div v-for="(cell, x) of item" :key="x">
      <DrumCell
        :path="soundsPath[i]"
        :is-active="cell === 1"
        :is-current-step="x === currentStep"
        :is-playing="isPlaying"
        @toggle-is-active="toggleIsActive(i, x, pattern)"
      />
    </div>
  </div>
</template>

<style scoped>
.row-container {
  display: flex;
}
.drum-type {
  width: 30px;
  height: 15px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  padding-right: 8px;
}
</style>
