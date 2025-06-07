import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePlayer } from '@/hooks/UsePlayer'

describe('usePlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  vi.mock('tone', () => {
    const mockPlayer = () => ({
      toDestination: () => mockPlayer(),
      load: vi.fn(),
      start: vi.fn(),
    })
    const mockPolySynth = () => ({
      toDestination: () => mockPolySynth(),
      triggerAttackRelease: vi.fn(),
      set: vi.fn(),
    })

    return {
      Player: vi.fn().mockImplementation(mockPlayer),
      PolySynth: vi.fn().mockImplementation(mockPolySynth),
      start: vi.fn(),
      Transport: {
        start: vi.fn(),
        stop: vi.fn(),
        scheduleRepeat: vi.fn().mockReturnValue(123),
        clear: vi.fn(),
        cancel: vi.fn(),
        loop: false,
        loopEnd: '',
      },
    }
  })

  it('初期状態で isPlaying は false、currentStep は 0', () => {
    const { isPlaying, currentStep } = usePlayer()
    expect(isPlaying.value).toBe(false)
    expect(currentStep.value).toBe(0)
  })

  it('start 関数で Tone.start や load が呼ばれる', async () => {
    const { start, isPlaying } = usePlayer()

    const mockTrack = {
      instruments: {
        drums: { pattern: Array(5).fill(Array(32).fill(0)) },
        synth: { waveType: 'sine', pattern: Array(24).fill(Array(32).fill(0)) },
        bass: { waveType: 'sine', pattern: Array(8).fill(Array(32).fill(0)) },
      },
    }

    await start(mockTrack)
    expect(isPlaying.value).toBe(true)
  })

  it('stop で Tone.Transport.stop などが呼ばれ、isPlaying が false に戻る', () => {
    const { stop, isPlaying, currentStep } = usePlayer()
    stop()
    expect(isPlaying.value).toBe(false)
    expect(currentStep.value).toBe(0)
  })
})
