import { useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { Episode, Series } from "../types";
import ConfirmDelete from "../components/ConfirmDelete";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type EpisodePageProps = {
  allSeries: Series[];
  allEpisodes: Episode[];
  addEpisode: (newEpisode: Episode) => void;
  updateEpisode: (updated: Episode) => void;
  deleteEpisode: (epId: string) => void;
};

function EpisodePage({
  allSeries,
  allEpisodes,
  addEpisode,
  updateEpisode,
  deleteEpisode,
}: EpisodePageProps) {
  const { id, episodeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const series = allSeries.find((s) => s.id === id);
  const existing = allEpisodes.find(
    (ep) => ep.id === episodeId && ep.seriesId === id,
  );
  const defaultSeason = Number(searchParams.get("season")) || 1;

  const [season, setSeason] = useState(
    String(existing?.season ?? defaultSeason),
  );
  const [number, setNumber] = useState(
    existing ? String(existing.episodeNumber) : "",
  );
  const [title, setTitle] = useState(existing?.title ?? "");
  const [link, setLink] = useState(existing?.link ?? "");
  const [platform, setPlatform] = useState(existing?.platform ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [watched, setWatched] = useState(existing?.watched ?? false);
  const [error, setError] = useState("");

  if (!series || (episodeId && !existing)) {
    return (
      <div className="space-y-4">
        <p>Episode tidak ditemukan</p>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          ← Watchlist
        </Link>
      </div>
    );
  }

  const seriesId = series.id;
  const backTo = `/series/${seriesId}?season=${
    existing ? existing.season : defaultSeason
  }`;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const seasonNum = Number(season);
    const episodeNum = Number(number);
    const cleanLink = link.trim();

    if (title.trim() === "") {
      setError("Judul episode wajib diisi");
      return;
    }
    if (!Number.isInteger(seasonNum) || seasonNum <= 0) {
      setError("Season harus angka lebih dari 0");
      return;
    }
    if (!Number.isInteger(episodeNum) || episodeNum <= 0) {
      setError("Nomor episode harus angka lebih dari 0");
      return;
    }
    if (cleanLink !== "" && !/^https?:\/\//.test(cleanLink)) {
      setError("Link harus diawali http:// atau https://");
      return;
    }

    const episode: Episode = {
      id: existing ? existing.id : crypto.randomUUID(),
      seriesId,
      season: seasonNum,
      episodeNumber: episodeNum,
      title: title.trim(),
      link: cleanLink || undefined,
      platform: platform || undefined,
      notes: notes.trim() || undefined,
      watched,
    };

    if (existing) {
      updateEpisode(episode);
    } else {
      addEpisode(episode);
    }
    navigate(`/series/${seriesId}?season=${seasonNum}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to={backTo}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {series.title}
        </Link>

        {existing && (
          <ConfirmDelete
            title={`Hapus episode ${existing.episodeNumber}?`}
            description={`${existing.title} akan dihapus permanen dan tidak bisa dikembalikan.`}
            onConfirm={() => {
              deleteEpisode(existing.id);
              navigate(backTo);
            }}
          >
            Hapus
          </ConfirmDelete>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border p-5"
      >
        <h1 className="text-lg font-semibold">
          {existing ? "Edit episode" : "Tambah episode"}
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ep-season">Season *</Label>
            <Input
              id="ep-season"
              type="number"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-number">Episode ke- *</Label>
            <Input
              id="ep-number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ep-title">Judul episode *</Label>
          <Input
            id="ep-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ep-link">Link</Label>
            <Input
              id="ep-link"
              type="text"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-platform">Platform</Label>
            <select
              id="ep-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className={selectClass}
            >
              <option value="">-</option>
              <option value="YouTube">YouTube</option>
              <option value="Netflix">Netflix</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ep-notes">Catatan</Label>
          <Textarea
            id="ep-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Status</legend>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="watched"
                className="accent-primary"
                checked={!watched}
                onChange={() => setWatched(false)}
              />
              Not Watched
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="watched"
                className="accent-primary"
                checked={watched}
                onChange={() => setWatched(true)}
              />
              Watched
            </label>
          </div>
        </fieldset>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(backTo)}
          >
            Batal
          </Button>
          <Button type="submit">
            {existing ? "Simpan perubahan" : "Tambah"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EpisodePage;