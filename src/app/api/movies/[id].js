// pages/api/movies/[id].js
import { updateMovie, deleteMovie } from "../../lib/database";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, year, image } = req.body;
    await updateMovie(id, title, year, image);
    res.status(200).json({ message: "Movie updated successfully" });
  } else if (req.method === "DELETE") {
    await deleteMovie(id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
