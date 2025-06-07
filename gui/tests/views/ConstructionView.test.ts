import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ConstructionView from '@/views/ConstructionView.vue'
import * as UseTracks from '@/hooks/UseTracks'
import * as UsePlayer from '@/hooks/UsePlayer'
import { createRouter, createMemoryHistory } from 'vue-router'
import ListView from '@/views/ListView.vue'
import { ref } from 'vue'

vi.mock('@/hooks/UseTracks.ts', () => ({
  getTrack: vi.fn(),
  updateTrack: vi.fn(),
  createTrack: vi.fn(),
}))

vi.mock('@/hooks/UsePlayer.ts', () => ({
  usePlayer: vi.fn(),
}))

describe('ConstructionView.vue', () => {
  const mockGetTrack = UseTracks.getTrack as ReturnType<typeof vi.fn>
  const mockUpdateTrack = UseTracks.updateTrack as ReturnType<typeof vi.fn>

  const mockStart = vi.fn()
  const mockStop = vi.fn()

  const mockIsPlaying = ref(false)
  const mockCurrentStep = 0
  const mockInst = {
    bass: { trigger: vi.fn(), dispose: vi.fn() },
    piano: { trigger: vi.fn(), dispose: vi.fn() },
  }

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/list',
        name: 'list',
        component: ListView,
      },
      {
        path: '/:id',
        name: 'edit',
        component: ConstructionView,
      },
    ],
  })

  beforeEach(async () => {
    vi.clearAllMocks()

    const usePlayerMock = UsePlayer.usePlayer as ReturnType<typeof vi.fn>
    usePlayerMock.mockReturnValue({
      start: mockStart,
      stop: mockStop,
      isPlaying: mockIsPlaying,
      currentStep: mockCurrentStep,
      inst: mockInst,
    })

    router.push('/1')
    await router.isReady()
  })

  it('画面ロード時に getTrack を呼び、データが表示される', async () => {
    mockGetTrack.mockResolvedValue({
      id: 1,
      name: 'テスト曲',
      instruments: {
        synth: { pattern: [], waveType: 'sine' },
        bass: { pattern: [], waveType: 'square' },
        drums: { pattern: [] },
      },
    })

    const wrapper = mount(ConstructionView, {
      global: {
        plugins: [router],
        stubs: {
          NameForm: {
            props: ['name'],
            template: '<div class="mock-name-form">{{ name }}</div>',
          },
        },
      },
    })

    await flushPromises()

    expect(mockGetTrack).toHaveBeenCalledWith(1)
    expect(wrapper.find('.mock-name-form').text()).toContain('テスト曲')
  })

  it('再生と停止ボタンが機能する', async () => {
    mockGetTrack.mockResolvedValue({
      id: 1,
      name: '曲A',
      instruments: {
        synth: { pattern: [], waveType: 'sine' },
        bass: { pattern: [], waveType: 'square' },
        drums: { pattern: [] },
      },
    })

    const wrapper = mount(ConstructionView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    const playBtn = wrapper.findAll('button')[0]
    const stopBtn = wrapper.findAll('button')[1]

    await playBtn.trigger('click')
    expect(mockStart).toHaveBeenCalled()

    await stopBtn.trigger('click')
    expect(mockStop).toHaveBeenCalled()
  })

  it('名前保存処理が動き、updateTrack が呼ばれる', async () => {
    mockGetTrack.mockResolvedValue({
      id: 1,
      name: 'もとの名前',
      instruments: {
        synth: { pattern: [], waveType: 'sine' },
        bass: { pattern: [], waveType: 'square' },
        drums: { pattern: [] },
      },
    })

    mockUpdateTrack.mockResolvedValue(true)
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(ConstructionView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    const nameForm = wrapper.findComponent({ name: 'NameForm' })
    await nameForm.vm.$emit('save', 'あたらしい名前')
    await flushPromises()

    expect(mockUpdateTrack).toHaveBeenCalled()
    expect(wrapper.vm.track.name).toBe('あたらしい名前')
  })
})
