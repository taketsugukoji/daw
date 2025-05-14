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
