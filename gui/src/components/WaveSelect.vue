<script setup lang="ts">
import { selectWaveItems } from '@/constants/track.ts'

const props = defineProps<{
  waveType: string
}>()

const emit = defineEmits<{
  (e: 'update:waveType', value: string): void
}>()

const onChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const newWave = target.value
  emit('update:waveType', newWave)
}
</script>

<template>
  <select :value="waveType" @change="onChange">
    <option v-for="item in selectWaveItems" :key="item.value" :value="item.value">
      {{ item.name }}
    </option>
  </select>
</template>
