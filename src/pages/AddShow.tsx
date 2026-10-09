import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Series, MediaType, WatchStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type AddShowProps = {
  addSeries: (newSeries: Series) => void;
  allSeries: Series[];
  updateSeries: (updated: Series) => void;
};

function AddShow({ addSeries, allSeries, updateSeries }: AddShowProps) {
  const { id } = useParams();
  const existing = allSeries.find((s) => s.id === id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [type, setType] = useState<MediaType>(existing?.type ?? "TV Series");
  const [genre, setGenre] = useState(existing?.genre ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [status, setStatus] = useState<WatchStatus>(
    existing?.status ?? "Plan to Watch",
  );
  const [year, setYear] = useState(existing?.year?.toString() ?? "");
  const [poster, setPoster] = useState(existing?.poster ?? "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (id && !existing) {
    return <p>Show tidak ditemukan</p>;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (title.trim() === "") {
      setError("Judul wajib diisi");
      return;
    }

    const data: Series = {
      id: existing ? existing.id : crypto.randomUUID(),
      title: title.trim(),
      type,
      status,
      year: year === "" ? undefined : Number(year),
      genre: genre.trim(),
      description: description.trim(),
      poster,
    };

    if (existing) {
      updateSeries(data);
      navigate(`/series/${existing.id}`);
    } else {
      addSeries(data);
      navigate("/");
    }
  }

  function handlePosterChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 400;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPoster(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Watchlist
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight">
        {existing ? "Edit Show" : "Tambah Show"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Tipe *</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as MediaType)}
              className={selectClass}
            >
              <option value="TV Series">TV Series</option>
              <option value="Movie">Movie</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as WatchStatus)}
              className={selectClass}
            >
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poster">Poster</Label>
          <Input
            id="poster"
            type="file"
            accept="image/*"
            onChange={handlePosterChange}
          />
          {poster && (
            <img
              src={poster}
              alt="Preview poster"
              className="mt-2 h-48 rounded-md object-cover"
            />
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(existing ? `/series/${existing.id}` : "/")}
          >
            Batal
          </Button>
          <Button type="submit">
            {existing ? "Simpan perubahan" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddShow;