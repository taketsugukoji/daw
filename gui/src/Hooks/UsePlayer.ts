import * as Tone from 'tone'
import { bassNotes, pianoNotes, soundsPath, type Track } from '@/constants/track.ts'
import { ref } from 'vue'

export const usePlayer = () => {
  const currentStep = ref(0)
  const isPlaying = ref(false)

  const piano = new Tone.PolySynth().toDestination()
  const bass = new Tone.PolySynth().toDestination()
  const kick = new Tone.Player().toDestination()
  const snare = new Tone.Player().toDestination()
  const hat = new Tone.Player().toDestination()
  const shaker = new Tone.Player().toDestination()
  const crash = new Tone.Player().toDestination()

  const handleDrumLoad = async () => {
    await Tone.start()
    await kick.load(soundsPath[4])
    await snare.load(soundsPath[3])
    await hat.load(soundsPath[2])
    await shaker.load(soundsPath[1])
    await crash.load(soundsPath[0])

    const exeList = [
      (time: number) => {
        crash.start(time)
      },
      (time: number) => {
        shaker.start(time)
      },
      (time: number) => {
        hat.start(time)
      },
      (time: number) => {
        snare.start(time)
      },
      (time: number) => {
        kick.start(time)
      },
    ]

    return exeList
  }

  let repeatId: number | null = null

  const start = async (track: Track) => {
    isPlaying.value = true

    const exeList = await handleDrumLoad()

    // 波形タイプセット
    piano.set({ oscillator: { type: track.instruments.synth.waveType } })
    bass.set({ oscillator: { type: track.instruments.bass.waveType } })

    Tone.Transport.loop = true
    Tone.Transport.loopEnd = '2m'

    repeatId = Tone.Transport.scheduleRepeat((time) => {
      track.instruments.drums.pattern.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          exeList[rowIndex](time)
        }
      })

      // piano
      track.instruments.synth.pattern.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          piano.triggerAttackRelease(pianoNotes[rowIndex], '16n', time)
        }
      })

      // bass
      track.instruments.bass.pattern.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          bass.triggerAttackRelease(bassNotes[rowIndex], '16n', time)
        }
      })
      currentStep.value = (currentStep.value + 1) % 32
    }, '16n')

    Tone.Transport.start()
  }

  const stop = () => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    if (repeatId) {
      Tone.Transport.clear(repeatId)
    }
    currentStep.value = 0
    isPlaying.value = false
  }

  return {
    start,
    stop,
    isPlaying,
    currentStep,
    inst: {
      kick,
      snare,
      hat,
      shaker,
      crash,
      bass,
      piano,
    },
  }
}
