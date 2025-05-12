<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isBlack: boolean // 白鍵か黒鍵か
}>()

const backGroundColorClass = computed(() => ({
  white: !props.isBlack,
  black: props.isBlack,
}))
</script>

<template>
  <div class="cell" :class="backGroundColorClass"></div>
</template>

<style scoped>
.cell {
  width: 30px;
  height: 15px;
}
.white {
  background-color: white;
}
.black {
  background-color: black;
}
</style>
