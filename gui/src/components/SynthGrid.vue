<script setup lang="ts">
import { pianoNotes } from '@/constants/track.ts'
import KeyCell from '@/components/KeyCell.vue'
import SynthCell from '@/components/SynthCell.vue'
import * as Tone from 'tone'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'

defineProps<{
  pattern: number[][]
  currentStep: number
  isPlaying: boolean
  tone: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>
  waveType: NonCustomOscillatorType
}>()

const emit = defineEmits<{
  (e: 'toggleIsActive', i: number, x: number): void
}>()
</script>

<template>
  <div class="column-container">
    <div v-for="(item, i) of pattern" :key="i" class="row-container">
      <div class="key-container">
        <KeyCell :is-black="pianoNotes.slice().reverse()[i].includes('#')" />
      </div>
      <div v-for="(cell, x) of item" :key="x" :class="{ 'octave-boundary': i === 11 }">
        <SynthCell
          :note="pianoNotes.slice().reverse()[i]"
          :is-active="cell === 1"
          :is-current-step="x === currentStep"
          :is-playing="isPlaying"
          :tone="tone"
          :wave-type="waveType"
          @toggle-is-active="emit('toggleIsActive', i, x)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.column-container {
  display: flex;
  flex-direction: column;
}
.row-container {
  display: flex;
}
.row-container > :nth-child(4n + 5) {
  border-right: 1px solid lightgray;
}
.key-container {
  padding-right: 8px;
}
.octave-boundary {
  border-bottom: 1px solid lightgray;
}
</style>
