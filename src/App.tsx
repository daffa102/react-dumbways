import { useState, useEffect } from "react";
import { initialEpisodes, initialSeries } from "./data";
import type { Episode, Series } from "./types";
import Detail from "./pages/Detail";
import Watchlist from "./pages/Watchlist";
import { Routes, Route } from "react-router-dom";
import AddShow from "./pages/AddShow";
import { loadFromStorage, saveToStorage } from "./utils/storage";
import EpisodePage from "./pages/EpisodePage";

function App() {
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>(() =>
    loadFromStorage<Episode[]>("watch-episodes", initialEpisodes),
  );

  const [allSeries, setAllSeries] = useState<Series[]>(() =>
    loadFromStorage<Series[]>("watch-series", initialSeries),
  );

  useEffect(() => {
    saveToStorage("watch-episodes", allEpisodes);
  }, [allEpisodes]);

  useEffect(() => {
    saveToStorage("watch-series", allSeries);
  }, [allSeries]);

  function toggleWatched(epId: string) {
    setAllEpisodes(
      allEpisodes.map((ep) => {
        if (ep.id === epId) {
          return { ...ep, watched: !ep.watched };
        }
        return ep;
      }),
    );
  }

  function addSeries(newSeries: Series) {
    setAllSeries([...allSeries, newSeries]);
  }

  const updateSeries = (updated: Series) => {
    setAllSeries(allSeries.map((s) => (s.id === updated.id ? updated : s)));
  };

  const addEpisode = (newEpisode: Episode) => {
    setAllEpisodes([...allEpisodes, newEpisode]);
  };

  const updateEpisode = (updated: Episode) => {
    setAllEpisodes(
      allEpisodes.map((ep) => (ep.id === updated.id ? updated : ep)),
    );
  };

  const deleteEpisode = (epId: string) => {
    setAllEpisodes(allEpisodes.filter((ep) => ep.id !== epId));
  };

  const deleteSeries = (seriesId: string) => {
    setAllSeries(allSeries.filter((s) => s.id !== seriesId));
    setAllEpisodes(allEpisodes.filter((ep) => ep.seriesId !== seriesId));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Routes>
        <Route
          path="/"
          element={
            <Watchlist allSeries={allSeries} allEpisodes={allEpisodes} />
          }
        />
        <Route
          path="/add"
          element={
            <AddShow
              addSeries={addSeries}
              allSeries={allSeries}
              updateSeries={updateSeries}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <AddShow
              addSeries={addSeries}
              allSeries={allSeries}
              updateSeries={updateSeries}
            />
          }
        />
        <Route
          path="/series/:id"
          element={
            <Detail
              allSeries={allSeries}
              allEpisodes={allEpisodes}
              toggleWatched={toggleWatched}
              deleteEpisode={deleteEpisode}
              deleteSeries={deleteSeries}
            />
          }
        />
        <Route
          path="/series/:id/episodes/new"
          element={
            <EpisodePage
              allSeries={allSeries}
              allEpisodes={allEpisodes}
              addEpisode={addEpisode}
              updateEpisode={updateEpisode}
              deleteEpisode={deleteEpisode}
            />
          }
        />
        <Route
          path="/series/:id/episodes/:episodeId/edit"
          element={
            <EpisodePage
              allSeries={allSeries}
              allEpisodes={allEpisodes}
              addEpisode={addEpisode}
              updateEpisode={updateEpisode}
              deleteEpisode={deleteEpisode}
            />
          }
        />
        <Route path="*" element={<p>Halaman tidak ditemukan</p>} />
      </Routes>
    </div>
  );
}

export default App;