"use client";
import React, { useEffect, useState } from "react";
import ImageDropZone from "./ImageDropZone";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { fileToBase64 } from "@/utils/utils";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Props {
  id: string | null;
  edit: boolean;
}
const AddEditMovieForm: React.FC<Props> = ({ edit, id }) => {
  const { push } = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    image: "",
  });
  const [files, setFiles] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    fetchData();
    setLoading(false);
  }, [id, edit]);

  const fetchData = async () => {
    const response = await fetch(`/api/movies/${id}`, {
      method: "GET",
    });

    const res = await response.json();

    if (res.status === 200) {
      if (Number(id) === res?.movie?.id) {
        setFormData({
          ...formData,
          title: res.movie.title,
          image: res.movie.image,
          year: res.movie.year,
        });
      }
    } else {
      toast.error(res.message, {
        className: "bg-white text-black dark:bg-gray-800 dark:text-white",
      });
    }
  };

  const validateForm = () => {
    let errorMessages: { [key: string]: string } = {};

    if (!formData.title) {
      errorMessages.title = "Title is required";
    }

    if (!formData.year) {
      errorMessages.year = "Publishing year is required";
    } else if (!/^\d{4}$/.test(formData.year)) {
      errorMessages.year = "Publishing year must be a valid 4-digit year";
    }

    if (files.length === 0 && !formData.image) {
      errorMessages.image = "Image is required";
    }

    setErrors(errorMessages);

    return Object.keys(errorMessages).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const filePromises = files.map((file: File) => fileToBase64(file));
        const base64Files = await Promise.all(filePromises);
        const newMovie = {
          title: formData.title,
          year: formData.year,
          image: base64Files[0] ?? formData.image,
        };

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const loggedInUser: any = jwt.verify(`${token}`, "secret");

            if (loggedInUser?.email) {
              if (edit && id !== undefined) {
                const response = await fetch(`/api/movies/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newMovie),
                });

                const res = await response.json();

                if (res.status === 200) {
                  toast.success(res.message, {
                    className:
                      "bg-white text-black dark:bg-gray-800 dark:text-white",
                  });
                  setTimeout(() => {
                    push("/");
                  }, 2000);
                } else {
                  toast.error(res.message, {
                    className:
                      "bg-white text-black dark:bg-gray-800 dark:text-white",
                  });
                }
              } else {
                const response = await fetch(
                  `/api/movies?email=${loggedInUser.email}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMovie),
                  }
                );

                const res = await response.json();

                if (res.status === 200) {
                  toast.success(res.message, {
                    className:
                      "bg-white text-black dark:bg-gray-800 dark:text-white",
                  });
                  setTimeout(() => {
                    push("/");
                  }, 2000);
                } else if (res.status === 404) {
                  toast.error(res.message, {
                    className:
                      "bg-white text-black dark:bg-gray-800 dark:text-white",
                  });
                } else {
                  toast.error(res.message, {
                    className:
                      "bg-white text-black dark:bg-gray-800 dark:text-white",
                  });
                }
              }
            } else {
              toast.error("You need to login first!!", {
                className:
                  "bg-white text-black dark:bg-gray-800 dark:text-white",
              });

              setTimeout(() => {
                push("/auth/sign-in");
              }, 2000);
            }
          } catch (error) {
            console.error("Token verification failed:", error);
          }
        } else {
          console.log("No token found in localStorage");
        }
      } catch (error) {
        console.error("Error converting files to Base64", error);
      }
    } else {
      console.log("Form has errors", errors);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },

    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["image"]: "Only one image can be uploaded at a time.",
        }));
        return;
      }

      acceptedFiles.forEach((file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        };
        return file;
      });
    },
  });

  return (
    <div className="text-white flex items-center justify-center p-4 md:p-6">
      <ToastContainer />
      {!loading ? (
        <div className="p-2 md:p-8 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl md:mb-6">
            {edit ? "Edit Movie" : "Create a new movie"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-10">
            <div className="flex flex-col items-center">
              {files.length === 0 && !formData.image && (
                <ImageDropZone
                  files={files}
                  setFiles={setFiles}
                  setIsModified={setIsModified}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {files.length > 0 ? (
                <>
                  <div className="cursor-pointer ">
                    {files.map((file: any, index: number) => (
                      <div key={index}>
                        <input {...getInputProps()} />

                        <img
                          {...getRootProps()}
                          key={index}
                          src={file.preview}
                          alt="Preview"
                          className=" object-cover w-full h-96"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                formData.image && (
                  <div>
                    <input {...getInputProps()} />

                    <img
                      {...getRootProps()}
                      src={formData.image}
                      alt="Preview"
                      className=" object-cover w-full h-96 cursor-pointer"
                    />
                  </div>
                )
              )}
              {errors.image && (
                <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                  {errors.image}
                </p>
              )}
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full px-3 py-2 text-gray-300 bg-[#224957] rounded focus:outline-none focus:ring focus:ring-green-500"
                  />
                  {errors.title && (
                    <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    id="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Publishing year"
                    className="w-1/2 px-3 py-2 text-gray-300 bg-[#224957] rounded focus:outline-none focus:ring focus:ring-green-500"
                  />
                  {errors.year && (
                    <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                      {errors.year}
                    </p>
                  )}
                </div>
                <div className="flex justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      push("/");
                    }}
                    className="text-white bg-transparent border border-gray-300 hover:bg-[#224957] font-medium rounded-lg text-sm px-10 py-2.5 me-2 mb-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-[#2BD17E] hover:bg-green-600 font-medium rounded-lg text-sm px-10 py-2.5 me-2 mb-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center text-white">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default AddEditMovieForm;
