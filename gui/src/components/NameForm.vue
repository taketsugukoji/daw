<script setup lang="ts">
import { ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const props = defineProps<{
  name: string
}>()
const emit = defineEmits<{ (e: 'save', value: string): void }>()

const formValue = ref(props.name)
const isFormChanged = ref(false)
const errorMessage = ref('')

const handleChange = () => {
  isFormChanged.value = true
}

const handleSave = () => {
  if (!formValue.value.trim()) {
    // TODO:vee-validateとか使得るようにしたい
    errorMessage.value = '曲名は1文字以上で入力してください'
    return
  }

  emit('save', formValue.value)
  isFormChanged.value = false
}

onBeforeRouteLeave(() => {
  if (isFormChanged.value) {
    const answer = window.confirm('遷移しますか？')

    if (!answer) {
      return false
    }
  }
})

// データ取得までのタイムラグがあるため
// TODO: いい感じに修正できるようにする
watch(
  () => props.name,
  (newVal) => {
    formValue.value = newVal
  },
)
</script>

<template>
  <div class="save-form">
    <input v-model="formValue" placeholder="名前" @change="handleChange" />
    <button @click="handleSave">保存</button>
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.save-form {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.save-form input {
  margin-right: 10px;
  padding: 5px;
}
</style>
