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
          console.log(loggedInUser.email);
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
            toast.error(res.message, {
              className: "bg-white text-black dark:bg-gray-800 dark:text-white",
            });
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
        console.error("Token verification failed:", error);
        toast.error("You need to login first!!", {
          className: "bg-white text-black dark:bg-gray-800 dark:text-white",
        });

        setTimeout(() => {
          push("/auth/sign-in");
        }, 2000);
      }
    } else {
      console.log("No token found in localStorage");
      toast.error("You need to login first!!", {
        className: "bg-white text-black dark:bg-gray-800 dark:text-white",
      });

      setTimeout(() => {
        push("/auth/sign-in");
      }, 2000);
    }
    setLoading(false);
  };

  const handleEditMovie = (movie: any, index: number) => {
    push(`movies/${index}`);
  };

  return (
    <div className="text-white p-4">
      {" "}
      <ToastContainer />
      {movies.length > 0 && !loading ? (
        <>
          {" "}
          <header className="flex justify-between items-center p-6">
            <div
              className="cursor-pointer"
              onClick={() => {
                push("/movies/movie-form");
              }}
            >
              <h1 className="flex items-center gap-2 text-xl md:text-3xl">
                My movies
                <PlusCircle className="mt-1 md:mt-1.5" />
              </h1>
            </div>
            <button
              className="flex items-center"
              onClick={() => {
                localStorage.clear();
                push("/auth/sign-in");
              }}
            >
              <span className="mr-2">Logout</span>
              <svg className="h-10 w-8" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-10 ">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="bg-[#0A2533] hover:bg-[#224957] p-4 rounded-lg shadow-lg cursor-pointer h-96 w-72"
                  onClick={() => handleEditMovie(movie, movie.id)}
                >
                  <div className=" flex justify-center items-center mb-4">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="rounded-md h-72 w-72 object-cover"
                    />
                  </div>
                  <h2 className="text-xl">{movie.title}</h2>
                  <p className="text-gray-400">{movie.year}</p>
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
