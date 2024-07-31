"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Movie } from "@/utils/utils";
import { PlusCircle } from "lucide-react";

function Movies() {
  const { push } = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const loggedInUser: any = jwt.verify(`${token}`, "secret");

        if (loggedInUser?.email) {
          const response = await fetch(
            `/api/movies?email=${loggedInUser.email}`,
            {
              method: "GET",
            }
          );

          const res = await response.json();

          if (res.status === 200) {
            setMovies(res.movies);
          } else if (res.status === 404) {
            push("/auth/sign-in");
          } else {
            toast.error(res.message, {
              className: "bg-white text-black dark:bg-gray-800 dark:text-white",
            });
          }
        } else {
          toast.error("You need to login first!!", {
            className: "bg-white text-black dark:bg-gray-800 dark:text-white",
          });

          setTimeout(() => {
            push("/auth/sign-in");
          }, 2000);
        }
      } catch (error) {
        push("/auth/sign-in");
      }
    } else {
      console.log("No token found in localStorage");
      push("/auth/sign-in");
    }
    setLoading(false);
  };

  const handleEditMovie = (movie: any, index: number) => {
    push(`movies/${index}`);
  };

  return (
    <div className="text-white py-10 min-h-screen">
      <ToastContainer />
      {movies.length > 0 && !loading ? (
        <>
          <header className="flex justify-between items-center px-4 md:px-32 py-6">
            <div
              className="cursor-pointer"
              onClick={() => {
                push("/movies/movie-form");
              }}
            >
              <p className="flex items-center gap-2 text-[14px] md:text-3xl">
                My movies
                <PlusCircle className="mt-1 md:mt-1.5" />
              </p>
            </div>
            <button
              className="flex items-center"
              onClick={() => {
                localStorage.clear();
                push("/auth/sign-in");
              }}
            >
              <span className="mr-4 hidden md:block">Logout</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.6667 6.66667L16.7867 8.54667L18.8933 10.6667H8V13.3333H18.8933L16.7867 15.44L18.6667 17.3333L24 12L18.6667 6.66667ZM2.66667 2.66667H12V0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H12V21.3333H2.66667V2.66667Z"
                  fill="white"
                />
              </svg>
            </button>
          </header>
          <main className="px-4 md:px-32">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="bg-[#0A2533] hover:bg-[#224957] p-1 md:p-1.5 rounded-lg shadow-lg cursor-pointer md:h-80"
                  onClick={() => handleEditMovie(movie, movie.id)}
                >
                  <div className="flex justify-center items-center mb-4">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="rounded-md h-44 md:h-60 w-full object-cover"
                    />
                  </div>
                  <div className="p-1">
                    <h2 className="text-sm md:text-xl ">{movie.title}</h2>
                    <p className="text-xs md:text-[14px] text-gray-400">
                      {movie.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      ) : (
        !loading && (
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
        )
      )}
    </div>
  );
}

export default Movies;
