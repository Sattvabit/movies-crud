"use client";
import { AppDispatch, RootState } from "@/store/store";
import { validateEmail, validatePassword } from "@/utils/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const users = useSelector((state: RootState) => state.user.users);
  const [usersData, setusersData] = useState<
    { email: string; password: string }[]
  >([]);
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

    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status === 200) {
        localStorage.setItem("token", data.token);
        push("/");
      } else {
        toast.error("Wrong Credentials", {
          className: "bg-white text-black dark:bg-gray-800 dark:text-white",
        });
      }
    } catch (error) {
      toast.error("Wrong Credentials", {
        className: "bg-white text-black dark:bg-gray-800 dark:text-white",
      });
    }
  };

  return (
    <section className="pt-40 pb-20">
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="p-8   w-80 md:w-96">
          <h2 className="text-4xl text-white mb-6 text-center">Sign in</h2>
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
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="text-green-500 focus:ring-0"
              />
              <label className="text-gray-400 text-sm ml-2" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              disabled={errors.password || errors.email}
              className="w-full bg-[#2BD17E] text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
