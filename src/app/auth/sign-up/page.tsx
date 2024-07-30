"use client";
import React from "react";
import dynamic from "next/dynamic";

const SignUp = dynamic(() => import("@/components/SignUp/SignUp"), {
  ssr: false,
});

const SignUpPage: React.FC = () => {
  return <SignUp />;
};

export default SignUpPage;
