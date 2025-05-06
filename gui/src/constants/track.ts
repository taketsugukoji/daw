import * as Tone from 'tone'

export interface Track {
  id?: number
  name: string
  pattern: {
    synth: number[][]
    bass: number[][]
    drums: number[][]
  }
}

export type TrackCreateParams = Omit<Track, 'id'>

export const pianoNotes = [
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
] as const

export const bassNotes = [
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
] as const

export const soundsPath = [
  '/sounds/crash.mp3',
  '/sounds/shaker.mp3',
  '/sounds/hat.mp3',
  '/sounds/snare.mp3',
  '/sounds/kick.mp3',
] as const

export const defaultTrack = {
  name: '',
  pattern: {
    synth: Array.from({ length: 24 }, () => Array(32).fill(0)),
    bass: Array.from({ length: 24 }, () => Array(32).fill(0)),
    drums: Array.from({ length: 5 }, () => Array(32).fill(0)),
  },
}

export const selectWaveItems = [
  { name: '正弦波', value: 'sine' },
  { name: '四角波', value: 'square' },
  { name: '三角波', value: 'triangle' },
  { name: 'ノコギリ波', value: 'sawtooth' },
]
