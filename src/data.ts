import type { Series, Episode } from "./types"

export const initialSeries: Series[] = [
    {
    id: "s1",
    title: "Demon Slayer",
    type: "TV Series",
    status: "Watching",
    genre: "Action",
    year: 2019,
    poster: "",
    description: "Pemburu iblis",
  },
    {
    id: "s2",
    title: "Breaking Bad",
    type: "TV Series",
    status: "Watching",
    genre: "Drama, Crime",
    year: 2008,
    poster: "",
    description: "Guru kimia yang terjun ke dunia narkoba.",
  }
]

export const initialEpisodes: Episode[] = [
  { id: "e1", seriesId: "s1", season: 1, episodeNumber: 1, title: "Cruelty", link: "", notes: "", watched: true },
  { id: "e2", seriesId: "s1", season: 1, episodeNumber: 2, title: "Trainer Sakonji Urokodaki", link: "", notes: "", watched: true },
  { id: "e3", seriesId: "s1", season: 1, episodeNumber: 3, title: "Sabito and Makomo", link: "", notes: "", watched: true },
  { id: "e4", seriesId: "s2", season: 1, episodeNumber: 1, title: "Pilot", link: "", notes: "", watched: false },
]