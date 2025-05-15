<script setup lang="ts">
import { ref, onMounted, type Ref, onUnmounted } from 'vue'
import router from '@/router'
import { deleteTrack, getAllTracks } from '@/Hooks/UseTracks.ts'
import { type Track } from '@/constants/track.ts'
import { usePlayer } from '@/Hooks/UsePlayer.ts'
import { Icon } from '@iconify/vue'

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
  const answer = confirm('対象の曲を削除しますか？')
  if (!answer) return

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
  <div>
    <div class="track-list">
      <h2>保存した曲一覧</h2>
      <div v-for="(track, index) in tracks" :key="track.id" class="track-item">
        <span>{{ track.name }}</span>
        <div class="operation-button" @click="handleUpdate(track.id as number)">編集</div>
        <div class="operation-button" @click="handleDeleteTrack(track.id as number)">削除</div>
        <button @click="stop" v-if="isPlaying && playingListIndex === index">
          <Icon icon="mdi:stop-circle" width="36" height="36" color="darkorange" />
        </button>
        <button @click="handleStart(track, index)" v-else>
          <Icon icon="mdi:play-circle" width="36" height="36" color="darkorange" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>


.track-item {
  display: grid;
  grid-template-columns: 6fr 1fr 1fr 1fr;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  border: none;
  cursor: pointer;
}

.operation-button {
  background-color: #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
}
</style>
