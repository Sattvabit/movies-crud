import { getMovieById, updateMovie } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "GET" && id) {
    const movie = await getMovieById(id);

    return NextResponse.json({
      status: 200,
      movie: movie,
    });
  } else {
    return NextResponse.json({
      status: 500,
      message: "Something went wrong",
    });
  }
}

export async function PUT(req: any, res: any) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "PUT" && id) {
    try {
      const movie = await getMovieById(id);

      if (!movie) {
        return NextResponse.json({
          status: 404,
          message: "movie not found",
        });
      }

      const body = await req.json();
      const { title, year, image } = body;

      await updateMovie(id, title, year, image);
      return NextResponse.json({
        status: 200,
        message: "movie updated successfully",
      });
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "Something went wrong",
      });
    }
  } else {
    return NextResponse.json({
      status: 500,
      message: "Something went wrong",
    });
  }
}
