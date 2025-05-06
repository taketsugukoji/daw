import * as Tone from 'tone'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'
import { selectWaveItems, type Track } from '@/constants/track.ts'

export const handleToggleIsActive = (
  rowNumber: number,
  colNumber: number,
  targetPattern: number[][],
) => {
  targetPattern[rowNumber][colNumber] = targetPattern[rowNumber][colNumber] === 1 ? 0 : 1
}

export const handleAllReset = (pattern: Track['pattern']) => {
  Object.values(pattern).forEach((item) => {
    item.forEach((i) => i.fill(0))
  })
}

export const handleChangeWave = (
  e: Event,
  targetTone: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>,
) => {
  const target = e.target as HTMLSelectElement
  const matchedType = selectWaveItems.find((item) => item.value === target.value)
  if (!matchedType) {
    throw new Error(`不適切な波形が指定されています: ${target.value}`)
  }
  const type = target.value as NonCustomOscillatorType
  targetTone.set({ oscillator: { type } })
}
