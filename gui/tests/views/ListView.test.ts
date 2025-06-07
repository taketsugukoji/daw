import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ListView from '@/views/ListView.vue'
import * as UseTracks from '@/hooks/UseTracks'
import * as UsePlayer from '@/hooks/UsePlayer'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@/hooks/UseTracks.ts', () => ({
  getAllTracks: vi.fn(),
  deleteTrack: vi.fn(),
}))

vi.mock('@/hooks/UsePlayer.ts', () => ({
  usePlayer: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:id', name: 'update', component: { template: '<div />' } }],
})

describe('ListView.vue', () => {
  // 型安全にモック関数を取得
  const mockGetAllTracks = UseTracks.getAllTracks as ReturnType<typeof vi.fn>
  const mockDeleteTrack = UseTracks.deleteTrack as ReturnType<typeof vi.fn>
  const mockUsePlayer = UsePlayer.usePlayer as ReturnType<typeof vi.fn>

  const mockStart = vi.fn()
  const mockStop = vi.fn()
  let mockIsPlaying = { value: false }

  beforeEach(() => {
    mockIsPlaying = { value: false }

    mockGetAllTracks.mockReset()
    mockDeleteTrack.mockReset()
    mockStart.mockReset()
    mockStop.mockReset()

    mockUsePlayer.mockReturnValue({
      start: mockStart,
      stop: mockStop,
      isPlaying: mockIsPlaying,
    })
  })

  it('画面ロード時に getAllTracks を呼び出し、曲一覧を表示する', async () => {
    mockGetAllTracks.mockResolvedValue([
      { id: 1, name: 'Track1' },
      { id: 2, name: 'Track2' },
    ])

    const wrapper = mount(ListView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(mockGetAllTracks).toHaveBeenCalled()
    expect(wrapper.text()).toContain('保存した曲一覧')
    expect(wrapper.text()).toContain('Track1')
    expect(wrapper.text()).toContain('Track2')
  })

  it('削除ボタンを押すと deleteTrack が呼ばれ、リストから削除される', async () => {
    mockGetAllTracks.mockResolvedValue([{ id: 1, name: 'Track1' }])
    mockDeleteTrack.mockResolvedValue(true)

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(ListView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    const buttons = wrapper.findAll('.operation-button')
    const deleteButton = buttons[1] // 編集→削除の順番想定
    await deleteButton.trigger('click')

    expect(mockDeleteTrack).toHaveBeenCalledWith(1)
    expect(wrapper.vm.tracks.length).toBe(0)
  })

  it('再生と停止ボタンの切り替えが動く', async () => {
    mockGetAllTracks.mockResolvedValue([{ id: 1, name: 'Track1' }])

    const wrapper = mount(ListView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    const playBtn = wrapper.find('button')
    await playBtn.trigger('click')
    expect(mockStart).toHaveBeenCalled()

    // 再レンダーのために再生状態を変更
    mockIsPlaying.value = true
    wrapper.vm.playingListIndex = 0
    await wrapper.vm.$nextTick()

    const stopBtn = wrapper.find('button')
    await stopBtn.trigger('click')
    expect(mockStop).toHaveBeenCalled()
  })
})
