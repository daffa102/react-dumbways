import { useState } from "react";
import { Link } from "react-router-dom";
import type { Episode, Series } from "../types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type WatchlistProps = {
  allSeries: Series[];
  allEpisodes: Episode[];
};

const selectClass =
  "h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Watchlist({ allSeries, allEpisodes }: WatchlistProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredSeries = allSeries.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || s.type === typeFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          MyWatch
        </h1>
        <Link to="/add" className={buttonVariants()}>
          + Add New
        </Link>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Search watchlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:flex-1"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={selectClass}
        >
          <option value="All">Semua tipe</option>
          <option value="TV Series">TV Series</option>
          <option value="Movie">Movie</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="All">Semua status</option>
          <option value="Plan to Watch">Plan to Watch</option>
          <option value="Watching">Watching</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {allSeries.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="mb-4 text-muted-foreground">
            Your watchlist is empty. Add your first show.
          </p>
          <Link to="/add" className={buttonVariants()}>
            Add your first show
          </Link>
        </div>
      )}

      {allSeries.length > 0 && filteredSeries.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          No shows match your search.
        </p>
      )}

      <ul className="grid gap-3">
        {filteredSeries.map((s) => {
          const eps = allEpisodes.filter((ep) => ep.seriesId === s.id);
          const watched = eps.reduce(
            (total, ep) => (ep.watched ? total + 1 : total),
            0,
          );
          const progress =
            eps.length === 0 ? 0 : Math.round((watched / eps.length) * 100);
          const info = [s.year, s.genre].filter(Boolean).join(" · ");

          return (
            <li key={s.id}>
              <Link to={`/series/${s.id}`} className="block">
                <Card className="flex-row gap-4 overflow-hidden py-0 transition-colors hover:border-primary/60 hover:bg-accent/40">
                  <div className="h-32 w-24 shrink-0 bg-muted">
                    {s.poster ? (
                      <img
                        src={s.poster}
                        alt={s.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                        {s.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-3 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold">
                        {s.title}
                      </h2>
                      <Badge variant="secondary">{s.type}</Badge>
                    </div>

                    {info && (
                      <p className="text-sm text-muted-foreground">{info}</p>
                    )}

                    {s.type === "TV Series" ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {progress}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {watched}/{eps.length} episode · {s.status}
                        </p>
                      </>
                    ) : (
                      <Badge
                        variant={s.status === "Completed" ? "default" : "outline"}
                        className="w-fit"
                      >
                        {s.status === "Completed" ? "✓ Completed" : s.status}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Watchlist;