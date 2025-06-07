import * as Tone from 'tone'
import type { NonCustomOscillatorType } from 'tone/Tone/source/oscillator/OscillatorInterface.ts'
import { type Track } from '@/constants/track.ts'

export const toggleIsActive = (rowNumber: number, colNumber: number, targetPattern: number[][]) => {
  targetPattern[rowNumber][colNumber] = targetPattern[rowNumber][colNumber] === 1 ? 0 : 1
}

export const handleInstReset = (
  track: Track,
  synthNeed: boolean,
  bassNeed: boolean,
  drumsNeed: boolean,
) => {
  const { synth, bass, drums } = track.instruments

  if (synthNeed) {
    synth.pattern.forEach((i) => i.fill(0))
    synth.waveType = 'sine'
  }
  if (bassNeed) {
    bass.pattern.forEach((i) => i.fill(0))
    bass.waveType = 'sine'
  }
  if (drumsNeed) {
    drums.pattern.forEach((i) => i.fill(0))
  }
}

export const handleChangeWave = (
  type: NonCustomOscillatorType,
  targetTone: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>,
  targetInst: 'synth' | 'bass', // 楽器の種類がさらに増えるなら enum にする
  track: Track,
) => {
  targetTone.set({ oscillator: { type } })

  switch (targetInst) {
    case 'synth':
      track.instruments.synth.waveType = type
      break
    case 'bass':
      track.instruments.bass.waveType = type
      break
    default:
      throw new Error(`不適切な楽器タイプです。${targetInst}`)
  }
}
