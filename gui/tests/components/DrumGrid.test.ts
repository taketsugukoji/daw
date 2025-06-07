import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DrumGrid from '@/components/DrumGrid.vue'
import DrumCell from '@/components/DrumCell.vue'
import { toggleIsActive } from '@/utils/track'

vi.mock('@/utils/track.ts', () => ({
  toggleIsActive: vi.fn(),
}))

const pattern = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
]

describe('DrumGrid.vue', () => {
  it('DrumCell コンポーネントが正しい数だけ描画される', () => {
    const wrapper = mount(DrumGrid, {
      props: {
        pattern,
        currentStep: 1,
        isPlaying: true,
      },
    })

    const cells = wrapper.findAllComponents(DrumCell)
    expect(cells.length).toBe(8)
  })

  it('DrumCell がイベントを emit したとき toggleIsActive が呼ばれる', async () => {
    const wrapper = mount(DrumGrid, {
      props: {
        pattern,
        currentStep: 0,
        isPlaying: false,
      },
    })

    const firstCell = wrapper.findAllComponents(DrumCell)[0]
    await firstCell.vm.$emit('toggle-is-active')

    expect(toggleIsActive).toHaveBeenCalled()
    expect(toggleIsActive).toHaveBeenCalledWith(0, 0, pattern)
  })
})
