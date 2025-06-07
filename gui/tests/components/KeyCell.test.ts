import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyCell from '@/components/KeyCell.vue'

describe('KeyCell.vue', () => {
  it('isBlack が false のとき、白鍵のクラスでレンダリングされる', () => {
    const wrapper = mount(KeyCell, {
      props: {
        isBlack: false,
      },
    })

    const cell = wrapper.find('.cell')
    expect(cell.classes()).toContain('white')
    expect(cell.classes()).not.toContain('black')
  })

  it('isBlack が true のとき、黒鍵のクラスでレンダリングされる', () => {
    const wrapper = mount(KeyCell, {
      props: {
        isBlack: true,
      },
    })

    const cell = wrapper.find('.cell')
    expect(cell.classes()).toContain('black')
    expect(cell.classes()).not.toContain('white')
  })
})
