"use client";
import { RootState } from "@/store/store";
import { Movie } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Movies() {
  const { push } = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const users = useSelector((state: RootState) => state.user.users);
  useEffect(() => {
    if (localStorage.getItem("Logged-In-User")) {
      const loggedInUser = JSON.parse(
        localStorage.getItem("Logged-In-User") ?? ""
      );

      if (loggedInUser?.email) {
        const user = users.find((user) => user.email === loggedInUser.email);
        if (user && user?.movies?.length! > 0) {
          setMovies(user.movies);
        }
      }
    }
  }, [users]);

  const handleEditMovie = (movie: any, index: number) => {
    push(`movies/${index}`);
  };

  return (
    <div className="text-white p-4">
      {movies.length > 0 ? (
        <>
          {" "}
          <header className="flex justify-between items-center p-6">
            <div
              className="cursor-pointer"
              onClick={() => {
                push("/movies/movie-form");
              }}
            >
              <h1 className="flex items-center text-3xl">
                My movies
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-circle-plus mt-1.5 ml-2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </h1>
            </div>
            <button
              className="flex items-center"
              onClick={() => {
                localStorage.clear();
              }}
            >
              <span className="mr-2">Logout</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 10a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </header>
          <main className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="bg-[#0A2533] p-4 rounded-lg shadow-lg"
                  onClick={() => handleEditMovie(movie, index)}
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="rounded-md mb-4 w-full h-48 object-cover"
                  />
                  <h2 className="text-xl">{movie.title}</h2>
                  <p className="text-gray-400">{movie.year}</p>
                </div>
              ))}
            </div>

            {/* <div className="flex justify-center mt-8 space-x-2">pagination</div> */}
          </main>{" "}
        </>
      ) : (
        <div className="flex items-center justify-center pt-40 pb-36">
          <div className="text-center">
            <h1 className="text-xl md:text-6xl mb-10 md:mb-16">
              Your movie list is empty
            </h1>
            <button
              onClick={() => {
                push("/movies/movie-form");
              }}
              className="bg-[#2BD17E] text-white px-10 py-4 rounded-xl hover:bg-green-600 transition-colors"
            >
              Add a new movie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
