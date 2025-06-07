import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SynthGrid from '@/components/SynthGrid.vue'
import SynthCell from '@/components/SynthCell.vue'
import { mockSynthInstance } from '../mock/tone'
import type { PolySynth, Synth, SynthOptions } from 'tone'

const pattern = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
]

describe('SynthGrid.vue', () => {
  it('SynthCell コンポーネントが正しい数だけ描画される', () => {
    const wrapper = mount(SynthGrid, {
      props: {
        pattern,
        currentStep: 1,
        isPlaying: true,
        tone: mockSynthInstance as unknown as PolySynth<Synth<SynthOptions>>,
        waveType: 'sine',
      },
    })

    const cells = wrapper.findAllComponents(SynthCell)
    expect(cells.length).toBe(8)
  })

  it('SynthCell がイベントを emit したとき toggleIsActive が呼ばれる', async () => {
    const wrapper = mount(SynthGrid, {
      props: {
        pattern,
        currentStep: 0,
        isPlaying: false,
        tone: mockSynthInstance as unknown as PolySynth<Synth<SynthOptions>>,
        waveType: 'sine',
      },
    })

    const firstCell = wrapper.findAllComponents(SynthCell)[0]
    await firstCell.vm.$emit('toggle-is-active')
  })
})
