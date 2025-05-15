<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { createTrack, getTrack, updateTrack } from '@/Hooks/UseTracks.ts'
import { defaultTrack, type Track } from '@/constants/track.ts'
import { handleInstReset, handleChangeWave, toggleIsActive } from '@/utils/track.ts'
import { usePlayer } from '@/Hooks/UsePlayer.ts'
import NameForm from '@/components/NameForm.vue'
import SynthGrid from '@/components/SynthGrid.vue'
import WaveSelect from '@/components/WaveSelect.vue'
import DrumGrid from '@/components/DrumGrid.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const id = route.params.id

const track = ref<Track>(defaultTrack)

const trackName = computed(() => track.value.name)

const handleSetupData = async () => {
  if (!id) return
  track.value = await getTrack(Number(id))
}

const { start, stop, isPlaying, currentStep, inst } = usePlayer()
const { bass, piano } = inst

const saveTrack = async (name: string) => {
  if (isPlaying.value) {
    stop()
  }
  const answer = window.confirm('変更内容を保存しますか？')
  if (!answer) {
    return false
  }

  track.value.name = name
  const { id, ...otherProps } = track.value

  if (id) {
    await updateTrack(track.value)
  } else {
    await createTrack(otherProps)
  }

  router.push({ name: 'list' })
}

onMounted(() => {
  handleSetupData()
})

onUnmounted(() => {
  handleInstReset(track.value, true, true, true)
})
</script>

<template>
  <div class="container">
    <h2>プロジェクト</h2>
    <div class="menu-container">
      <button @click="start(track)">
        <Icon
          icon="mdi:play-circle"
          width="36"
          height="36"
          class="icon"
          :class="{ active: !isPlaying }"
        />
      </button>
      <button @click="stop">
        <Icon
          icon="mdi:stop-circle"
          width="36"
          height="36"
          class="icon"
          :class="{ active: isPlaying }"
        />
      </button>
      <NameForm :name="trackName" @save="saveTrack" />
    </div>
    <div class="grid-container">
      PIANO
      <div>
        <WaveSelect
          v-model:wave-type="track.instruments.synth.waveType"
          @update:wave-type="(value) => handleChangeWave(value, piano, 'synth', track)"
        />
      </div>
      <SynthGrid
        :pattern="track.instruments.synth.pattern"
        :current-step="currentStep"
        :is-playing="isPlaying"
        :tone="piano"
        :wave-type="track.instruments.synth.waveType"
        @toggle-is-active="(i, x) => toggleIsActive(i, x, track.instruments.synth.pattern)"
      />
    </div>
    <div class="grid-container">
      Bass
      <div>
        <WaveSelect
          v-model:wave-type="track.instruments.bass.waveType"
          @update:wave-type="(value) => handleChangeWave(value, bass, 'bass', track)"
        />
      </div>
      <div>
        <SynthGrid
          :pattern="track.instruments.bass.pattern"
          :current-step="currentStep"
          :is-playing="isPlaying"
          :tone="bass"
          :wave-type="track.instruments.bass.waveType"
          @toggle-is-active="(i, x) => toggleIsActive(i, x, track.instruments.bass.pattern)"
        />
      </div>
    </div>

    <div class="grid-container">
      DRUM
      <div>
        <DrumGrid
          :pattern="track.instruments.drums.pattern"
          :currentStep="currentStep"
          :is-playing="isPlaying"
        />
      </div>
    </div>

    <div @click="handleInstReset(track, true, true, true)">all reset</div>
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
  align-items: center;
}
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

button {
  border: none;
  cursor: pointer;
}

.icon {
  color: gray;
}

.icon.active {
  color: darkorange;
}
</style>
