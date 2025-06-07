import type { Track, TrackCreateParams } from '@/constants/track.ts'

export const createTrack = async (track: TrackCreateParams) => {
  try {
    const response = await fetch('http://localhost:8000/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(track),
    })
    await response.json()
  } catch (error) {
    console.error('曲作成エラー:', error)
  }
}

export const updateTrack = async (track: Track) => {
  if (!track.id) {
    throw new Error('更新する場合は id を指定してください。')
  }
  const { id, ...otherProps } = track

  try {
    const response = await fetch(`http://localhost:8000/track/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(otherProps),
    })
    await response.json()
  } catch (error) {
    console.error('曲更新エラー:', error)
  }
}

export const getTrack = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/track/${id}`)
    return await response.json()
  } catch (error) {
    console.error('曲詳細取得エラー:', error)
  }
}

export const getAllTracks = async () => {
  try {
    const response = await fetch('http://localhost:8000/track')
    return response.json()
  } catch (error) {
    console.error('曲一覧取得エラー:', error)
  }
}

export const deleteTrack = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/track/${id}`, {
      method: 'delete',
    })
    await response.json()
  } catch (error) {
    console.error('曲削除エラー:', error)
  }
}
