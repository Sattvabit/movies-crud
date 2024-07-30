"use client";
import { AppDispatch, RootState } from "@/store/store";
import { addUser } from "@/store/userSlice";
import { validateEmail, validatePassword } from "@/utils/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const users = useSelector((state: RootState) => state.user.users);
  const [usersData, setusersData] = useState<
    { email: string; password: string }[]
  >([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setusersData(users);
  }, [users]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    let errorMessages: any = { ...errors };
    if (id === "email" && !validateEmail(value)) {
      errorMessages.email = "Invalid email format";
    } else if (id === "email") {
      delete errorMessages.email;
    }
    if (id === "password" && !validatePassword(value)) {
      errorMessages.password =
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character";
    } else if (id === "password") {
      delete errorMessages.password;
    }
    if (id === "confirmedPassword" && value !== formData.password) {
      errorMessages.confirmedPassword = "Passwords do not match";
    } else if (id === "confirmedPassword") {
      delete errorMessages.confirmedPassword;
    }
    setErrors(errorMessages);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let errorMessages: any = {};

    if (!validateEmail(formData.email)) {
      errorMessages.email = "Invalid email format";
    }

    if (!validatePassword(formData.password)) {
      errorMessages.password =
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character";
    }

    if (formData.password !== formData.confirmedPassword) {
      errorMessages.confirmedPassword = "Passwords do not match";
    }

    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res: any = await response.json();

      if (res.status === 200) {
        toast.success(res.message, {
          className: "bg-white text-black dark:bg-gray-800 dark:text-white",
        });
        setFormData({ confirmedPassword: "", email: "", password: "" });
        setTimeout(() => {
          push("/auth/sign-in");
        }, 2000);
      } else {
        toast.error(res.message, {
          className: "bg-white text-black dark:bg-gray-800 dark:text-white",
        });
      }
    } catch (error) {
      toast.error("User registration failed", {
        className: "bg-white text-black dark:bg-gray-800 dark:text-white",
      });
    }

    // if (usersData.findIndex((user) => user.email === formData.email) === -1) {
    //   dispatch(
    //     addUser({
    //       email: formData.email,
    //       password: formData.password,
    //       movies: [],
    //     })
    //   );
    //   toast.success("User added successfully", {
    //     className: "bg-white text-black dark:bg-gray-800 dark:text-white",
    //   });
    //   setFormData({ confirmedPassword: "", email: "", password: "" });
    //   push("/auth/sign-in");
    // } else {
    //   toast.error("email already exists", {
    //     className: "bg-white text-black dark:bg-gray-800 dark:text-white",
    //   });
    // }
  };

  return (
    <section className="pt-36 pb-20">
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="p-8  w-80 md:w-96 rounded-lg ">
          <h2 className="text-4xl text-white mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-gray-300 bg-[#224957] rounded focus:outline-none focus:ring ${
                  errors.email ? `focus:ring-[#EB5757]` : `focus:ring-[#2BD17E]`
                }`}
              />
              {errors.email && (
                <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-gray-300 bg-[#224957] rounded focus:outline-none focus:ring ${
                  errors.password
                    ? `focus:ring-[#EB5757]`
                    : `focus:ring-[#2BD17E]`
                }`}
              />
              {errors.password && (
                <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="confirmedPassword"
              >
                Confirmed Password
              </label>
              <input
                type="password"
                id="confirmedPassword"
                value={formData.confirmedPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-gray-300 bg-[#224957] rounded focus:outline-none focus:ring ${
                  errors.confirmedPassword
                    ? `focus:ring-[#EB5757]`
                    : `focus:ring-[#2BD17E]`
                }`}
              />
              {errors.confirmedPassword && (
                <p className="text-[#EB5757] text-xs mt-1.5 ml-1">
                  {errors.confirmedPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                errors.confirmedPassword || errors.password || errors.email
              }
              className="w-full bg-[#2BD17E] text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
