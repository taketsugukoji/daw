import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SynthCell from '@/components/SynthCell.vue'
import { setMock, triggerMock, mockSynthInstance } from '../mock/tone'

describe('SynthCell.vue', () => {
  it('クリックで toggleIsActive を emit し、ノートが再生される', async () => {
    const wrapper = mount(SynthCell, {
      props: {
        note: 'C4',
        isActive: false,
        isCurrentStep: false,
        isPlaying: false,
        waveType: 'sine',
        tone: mockSynthInstance,
      },
    })

    await wrapper.trigger('click')

    expect(setMock).toHaveBeenCalledWith({ oscillator: { type: 'sine' } })
    expect(triggerMock).toHaveBeenCalledWith('C4', '16n')
    expect(wrapper.emitted()).toHaveProperty('toggleIsActive')
  })
})
