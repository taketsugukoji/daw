<script setup lang="ts">
import { ref, onMounted, type Ref, onUnmounted } from 'vue'
import router from '@/router'
import { deleteTrack, getAllTracks } from '@/Hooks/UseTracks.ts'
import { type Track } from '@/constants/track.ts'
import { usePlayer } from '@/Hooks/UsePlayer.ts'

const tracks = ref<Track[]>([])
const playingListIndex: Ref<null | number> = ref(null)

const { start, stop, isPlaying } = usePlayer()

const fetchTracks = async () => {
  const res = await getAllTracks()
  tracks.value = res
}

const handleUpdate = (id: number) => {
  router.push({ name: 'update', params: { id } })
}

const handleDeleteTrack = async (id: number) => {
  await deleteTrack(id)
  tracks.value = tracks.value.filter((track) => track.id !== id)
}

const handleStart = (track: Track, index: number) => {
  if (isPlaying.value) {
    stop()
  }
  playingListIndex.value = index
  start(track)
}

onMounted(() => {
  fetchTracks()
})

onUnmounted(() => {
  if (isPlaying.value) {
    stop()
  }
})
</script>

<template>
  <div class="track-manager">
    <div class="track-list">
      <h2>保存した曲一覧</h2>
      <div v-for="(track, index) in tracks" :key="track.id" class="track-item">
        <span>名前: {{ track.name }}</span>
        <button @click="stop" v-if="isPlaying && playingListIndex === index">⏹️</button>
        <button @click="handleStart(track, index)" v-else>▶️</button>
        <div @click="handleUpdate(track.id as number)">編集</div>
        <div @click="handleDeleteTrack(track.id as number)">削除</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.track-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: white;
}

button[onclick*='delete'] {
  background-color: #f44336;
}

button[onclick*='delete']:hover {
  background-color: #da190b;
}
</style>
