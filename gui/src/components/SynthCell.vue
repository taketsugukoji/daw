<script setup lang="ts">
import * as Tone from 'tone'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'

const props = defineProps<{
  note: string
  isActive: boolean
  isCurrentStep: boolean
  isPlaying: boolean
  tone: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>
  waveType: NonCustomOscillatorType
}>()

const emit = defineEmits(['toggleIsActive'])

const playSound = async () => {
  await Tone.start()
  props.tone.set({ oscillator: { type: props.waveType } })
  props.tone.triggerAttackRelease(props.note, '16n')
}

function buttonClick() {
  emit('toggleIsActive')
  playSound()
}
</script>

<template>
  <div
    @click="buttonClick"
    class="cell"
    :class="{
      active: isActive,
      lighting: isActive && isCurrentStep && isPlaying,
    }"
  ></div>
</template>

<style scoped>
.cell {
  width: 30px;
  height: 15px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.cell.active {
  background-color: darkorange;
  border-color: orangered;
  box-shadow: 0 0 6px orange;
}

.cell.lighting {
  background-color: gold;
  border-color: goldenrod;
  box-shadow: 0 0 10px 2px yellow;
}
</style>
