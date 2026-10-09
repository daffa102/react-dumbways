import type { Episode, Series } from "../types";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";
import ConfirmDelete from "../components/ConfirmDelete";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type DetailProps = {
  allEpisodes: Episode[];
  allSeries: Series[];
  toggleWatched: (epId: string) => void;
  deleteEpisode: (epId: string) => void;
  deleteSeries: (seriesId: string) => void;
};

function Detail({
  allEpisodes,
  allSeries,
  toggleWatched,
  deleteEpisode,
  deleteSeries,
}: DetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const series = allSeries.find((s) => s.id === id);

  const [selectedSeason, setSelectedSeason] = useState(
    Number(searchParams.get("season")) || 1,
  );

  if (!series) {
    return (
      <div className="space-y-4">
        <p>Show tidak ditemukan</p>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          ← Watchlist
        </Link>
      </div>
    );
  }

  const episodes = allEpisodes.filter((ep) => ep.seriesId === series.id);

  const seasons = [...new Set(episodes.map((ep) => ep.season))].sort(
    (a, b) => a - b,
  );

  const activeSeason = seasons.includes(selectedSeason)
    ? selectedSeason
    : seasons[0];

  const visibleEpisodes = episodes
    .filter((ep) => ep.season === activeSeason)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const watchedCount = episodes.reduce(
    (total, ep) => (ep.watched ? total + 1 : total),
    0,
  );

  const progress =
    episodes.length === 0
      ? 0
      : Math.round((watchedCount / episodes.length) * 100);

  const info = [series.year, series.genre].filter(Boolean).join(" · ");

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Watchlist
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        {series.poster && (
          <img
            src={series.poster}
            alt={series.title}
            className="w-40 self-start rounded-lg object-cover sm:w-48"
          />
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {series.title}
            </h1>
            <div className="flex gap-2">
              <Link
                to={`/edit/${series.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Edit
              </Link>
              <ConfirmDelete
                title={`Hapus ${series.title}?`}
                description="Show ini beserta semua episodenya akan dihapus permanen dan tidak bisa dikembalikan."
                onConfirm={() => {
                  deleteSeries(series.id);
                  navigate("/");
                }}
              >
                Hapus
              </ConfirmDelete>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{series.type}</Badge>
            {info && (
              <span className="text-sm text-muted-foreground">{info}</span>
            )}
            <Badge
              variant={series.status === "Completed" ? "default" : "outline"}
            >
              {series.status === "Completed" ? "✓ Completed" : series.status}
            </Badge>
          </div>

          {series.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {series.description}
            </p>
          )}
        </div>
      </div>

      {series.type === "TV Series" && (
        <section className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {watchedCount} dari {episodes.length} episode
              </span>
              <span className="font-medium tabular-nums">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {seasons.map((n) => (
              <Button
                key={n}
                type="button"
                size="sm"
                variant={n === activeSeason ? "default" : "outline"}
                onClick={() => setSelectedSeason(n)}
              >
                Season {n}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Episodes</h2>
            <Link
              to={`/series/${series.id}/episodes/new?season=${activeSeason ?? 1}`}
              className={buttonVariants({ size: "sm" })}
            >
              + Tambah episode
            </Link>
          </div>

          {visibleEpisodes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada episode. Klik "+ Tambah episode".
            </p>
          )}

          {visibleEpisodes.length > 0 && (
            <ul className="divide-y rounded-lg border">
              {visibleEpisodes.map((ep) => (
                <li
                  key={ep.id}
                  className="flex flex-wrap items-center gap-3 p-3"
                >
                  <Button
                    type="button"
                    size="sm"
                    className="w-32"
                    variant={ep.watched ? "default" : "outline"}
                    aria-pressed={ep.watched}
                    onClick={() => toggleWatched(ep.id)}
                  >
                    {ep.watched ? "✓ Watched" : "○ Not Watched"}
                  </Button>

                  <div className="min-w-0 flex-1">
                    <p className={ep.watched ? "text-muted-foreground" : ""}>
                      <span className="mr-2 tabular-nums text-muted-foreground">
                        {ep.episodeNumber}
                      </span>
                      {ep.title}
                    </p>
                    {ep.notes && (
                      <p className="text-xs text-muted-foreground">
                        {ep.notes}
                      </p>
                    )}
                  </div>

                  {ep.platform && <Badge variant="outline">{ep.platform}</Badge>}

                  <div className="flex items-center gap-1">
                    {ep.link && (
                      <a
                        href={ep.link}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({
                          variant: "link",
                          size: "sm",
                        })}
                      >
                        Tonton ↗
                      </a>
                    )}
                    <Link
                      to={`/series/${series.id}/episodes/${ep.id}/edit`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>
                    <ConfirmDelete
                      variant="ghost"
                      title={`Hapus episode ${ep.episodeNumber}?`}
                      description={`${ep.title} akan dihapus permanen dan tidak bisa dikembalikan.`}
                      onConfirm={() => deleteEpisode(ep.id)}
                    >
                      Hapus
                    </ConfirmDelete>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default Detail;