import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import * as Tone from 'tone'
import DrumCell from '@/components/DrumCell.vue'

vi.mock('tone', async () => {
  const tone = await import('../mock/tone')
  return tone.mockTone
})

describe('DrumCell.vue', () => {
  const baseProps = {
    path: 'test.mp3',
    isActive: false,
    isCurrentStep: false,
    isPlaying: false,
  }

  it('DrumCellが描画される', () => {
    const wrapper = mount(DrumCell, { props: baseProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('isActive が true であれば class が active になっている', () => {
    const wrapper = mount(DrumCell, {
      props: { ...baseProps, isActive: true },
    })
    expect(wrapper.classes()).toContain('active')
  })

  it('isActive, isCurrentStep, isPlaying が true であれば class が lighting になっている', () => {
    const wrapper = mount(DrumCell, {
      props: {
        ...baseProps,
        isActive: true,
        isCurrentStep: true,
        isPlaying: true,
      },
    })
    expect(wrapper.classes()).toContain('lighting')
  })

  it('クリック後 toggleIsActive emit が発火', async () => {
    const wrapper = mount(DrumCell, { props: baseProps })
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('toggleIsActive')
  })

  it('クリック後 playSound を実行する', async () => {
    const wrapper = mount(DrumCell, {
      props: baseProps,
    })

    await wrapper.trigger('click')

    expect(Tone.start).toHaveBeenCalled()
    const PlayerMock = Tone.Player as unknown as ReturnType<typeof vi.fn>
    expect(PlayerMock).toHaveBeenCalled()
    expect(PlayerMock().start).toHaveBeenCalled()
  })
})
