<script setup lang="ts">
import { selectWaveItems } from '@/constants/track.ts'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'

defineProps<{
  waveType: NonCustomOscillatorType
}>()

const emit = defineEmits<{
  (e: 'update:waveType', value: NonCustomOscillatorType): void
}>()

const onChange = (e: Event) => {
  const target = e.target as HTMLSelectElement

  const matchedType = selectWaveItems.find((item) => item.value === target.value)
  if (!matchedType) {
    throw new Error(`不適切な波形が指定されています: ${target.value}`)
  }
  const type = target.value as NonCustomOscillatorType
  emit('update:waveType', type)
}
</script>

<template>
  <select :value="waveType" @change="onChange">
    <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
      {{ item.name }}
    </option>
  </select>
</template>
