import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WaveSelect from '@/components/WaveSelect.vue'
import { selectWaveItems } from '@/constants/track'

describe('WaveSelect.vue', () => {
  it('propsで渡されたwaveTypeがselectに反映されてる', () => {
    const wrapper = mount(WaveSelect, {
      props: {
        waveType: 'sine',
      },
    })
    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe('sine')
  })

  it('セレクト変更でemitされる', async () => {
    const wrapper = mount(WaveSelect, {
      props: {
        waveType: 'sine',
      },
    })
    const select = wrapper.find('select')
    await select.setValue('square')

    expect(wrapper.emitted('update:waveType')).toBeTruthy()
    expect(wrapper.emitted('update:waveType')![0]).toEqual(['square'])
  })

  it('全てのオプションが表示されている', () => {
    const wrapper = mount(WaveSelect, {
      props: {
        waveType: 'sine',
      },
    })
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(selectWaveItems.length)
  })
})
