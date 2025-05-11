<script setup lang="ts">
import * as Tone from 'tone'

const props = defineProps<{
  path: string
  isActive: boolean
  isCurrentStep: boolean
  isPlaying: boolean
}>()

const emit = defineEmits(['toggleIsActive'])

const playSound = async () => {
  await Tone.start()
  const player = new Tone.Player().toDestination()

  await player.load(props.path)

  player.start()
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
      active: props.isActive,
      lighting: props.isActive && props.isCurrentStep && props.isPlaying,
    }"
  ></div>
</template>

<style scoped>
.cell {
  width: 30px;
  height: 15px;
  border: 2px solid #ddd;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell.active {
  background-color: deepskyblue;
  border-color: darkblue;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 6px darkblue;
}

.cell.lighting {
  box-shadow: 0 0 10px 2px yellow;
  border-color: gold;
}
</style>
