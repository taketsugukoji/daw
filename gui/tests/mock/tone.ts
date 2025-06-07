import { vi } from 'vitest'

export const mockStart = vi.fn()
export const mockLoad = vi.fn(() => Promise.resolve())
export const mockToDestination = vi.fn().mockReturnThis()
export const triggerMock = vi.fn()
export const setMock = vi.fn()

// Drum用
export const mockPlayerInstance = {
  start: mockStart,
  load: mockLoad,
  toDestination: mockToDestination,
}

// Synth用
export const mockSynthInstance = {
  triggerAttackRelease: triggerMock,
  set: setMock,
}

export const mockTone = {
  start: vi.fn(() => Promise.resolve()),
  Player: vi.fn(() => mockPlayerInstance),
}
