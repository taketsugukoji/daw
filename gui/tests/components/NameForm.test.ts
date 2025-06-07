import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NameForm from '@/components/NameForm.vue'

describe('NameForm.vue', () => {
  it('初期値が表示される', () => {
    const wrapper = mount(NameForm, {
      props: {
        name: 'My Song',
      },
    })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('My Song')
  })

  it('名前を入力して保存ボタンでemitされる', async () => {
    const wrapper = mount(NameForm, {
      props: {
        name: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('New Title')

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')![0]).toEqual(['New Title'])
  })
})
