<script setup lang="ts">
import { pianoNotes } from '@/constants/track.ts'
import KeyCell from '@/components/KeyCell.vue'
import SynthCell from '@/components/SynthCell.vue'
import * as Tone from 'tone'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'

const props = defineProps<{
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
  <div v-for="(item, i) of props.pattern" :key="i" class="row-container">
    <div class="tone-container">
      <KeyCell :is-black="pianoNotes.slice().reverse()[i].includes('#')" />
      <div v-for="(cell, x) of item" :key="x">
        <SynthCell
          :note="pianoNotes.slice().reverse()[i]"
          :is-active="cell === 1"
          :is-current-step="x === currentStep"
          :is-playing="isPlaying"
          :tone="props.tone"
          :wave-type="props.waveType"
          @toggle-is-active="emit('toggleIsActive', i, x)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.row-container {
  display: flex;
}
.tone-container {
  display: flex;
}
</style>
