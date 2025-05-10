import * as Tone from 'tone'
import { bassNotes, pianoNotes, soundsPath, type Track } from '@/constants/track.ts'
import { ref } from 'vue'

export const usePlayer = () => {
  const currentStep = ref(0)
  const isPlaying = ref(false)
  const isRendering = ref(false)

  const piano = new Tone.PolySynth().toDestination()
  const bass = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sawtooth' } }).toDestination()
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

    const exeList = await handleDrumLoad();

    Tone.Transport.loop = true
    Tone.Transport.loopEnd = '2m'

    repeatId = Tone.Transport.scheduleRepeat((time) => {
      track.pattern.drums.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          exeList[rowIndex](time)
        }
      })

      // piano
      track.pattern.synth.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          piano.triggerAttackRelease(pianoNotes.slice().reverse()[rowIndex], '16n', time)
        }
      })

      // bass
      track.pattern.bass.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          bass.triggerAttackRelease(bassNotes.slice().reverse()[rowIndex], '16n', time)
        }
      })
      currentStep.value = (currentStep.value + 1) % 32
    }, '16n')

    Tone.Transport.start()
  }

  const stop = () => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    if(repeatId){
      Tone.Transport.clear(repeatId)
    }
    currentStep.value = 0
    isPlaying.value = false
  }

  const download = async (data: Track) => {
    if (isPlaying.value) {
      stop() // 再生中なら停止
    }

    isRendering.value = true // レンダリング中フラグ

    // Tone.context が開始されていなければ最初に開始
    await Tone.start()

    const exeList = await handleDrumLoad();

    // 2回目以降リセットされないので既存のスケジュールを全部クリア
    Tone.Transport.cancel()

    // 録音用のセットアップ
    const actx = Tone.context
    const dest = actx.createMediaStreamDestination()
    const recorder = new MediaRecorder(dest.stream)
    const chunks = [];

    // 出力先を録音用に設定
    [kick, snare, hat, shaker, crash, piano, bass].forEach((player) => player.connect(dest))

    // 録音開始
    recorder.start()

    // 録音データが用意されたら、そのデータをchunks配列に保存
    recorder.ondataavailable = (evt) => chunks.push(evt.data)

    // 録音停止後にダウンロード処理
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mp3; codecs=opus' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated_audio.mp3' // 自動ダウンロードするファイル名
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      isRendering.value = false
      Tone.Transport.stop()
      currentStep.value = 0
    }

    // 32ステップのパターンをスケジュール
    Tone.Transport.scheduleRepeat((time) => {
      data.pattern.drums.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          exeList[rowIndex](time)
        }
      })

      // piano
      data.pattern.synth.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          piano.triggerAttackRelease(pianoNotes.slice().reverse()[rowIndex], '16n', time)
        }
      })

      // bass
      data.pattern.bass.forEach((row, rowIndex) => {
        if (row[currentStep.value] === 1) {
          bass.triggerAttackRelease(bassNotes.slice().reverse()[rowIndex], '16n', time)
        }
      })

      // 32ステップ終了時
      if (currentStep.value === 31) {
        recorder.stop() // 録音停止
      }

      currentStep.value = (currentStep.value + 1) % 32
    }, '16n')

    // 録音と再生開始
    Tone.Transport.start()
  }

  return {
    start,
    stop,
    download,
    isPlaying,
    isRendering,
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
