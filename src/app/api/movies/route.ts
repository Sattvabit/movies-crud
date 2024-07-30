import { addMovie, getMoviesByUserId, getUserByEmail } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  const { email } = req.query;
  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json({
      status: 404,
      message: "User not found",
    });
  }

  if (req.method === "GET") {
    const movies = await getMoviesByUserId(user.id);

    return NextResponse.json({
      status: 200,
      movies: movies,
    });
  } else if (req.method === "POST") {
    const { title, year, image } = req.body;
    await addMovie(user.id, title, year, image);

    return NextResponse.json({
      status: 200,
      message: "Movie added successfully",
    });
  } else {
    return NextResponse.json({
      status: 500,
      message: "Something went wrong",
    });
  }
}
