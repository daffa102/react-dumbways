export type MediaType = "Movie" | "TV Series"
export type WatchStatus = "Plan to Watch" | "Watching" | "Completed"

export type Series = {
  id: string
  title: string
  type: MediaType
  poster?: string
  genre?: string
  year?: number
  status: WatchStatus
  description?: string
}

export type Episode = {
  id: string
  seriesId: string
  season: number
  episodeNumber: number
  title: string
  platform?: string
  link?: string
  notes?: string
  watched: boolean
}