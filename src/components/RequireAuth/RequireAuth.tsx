import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/auth/sign-in");
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <div></div>;
  }

  return <>{children}</>;
};

export default RequireAuth;
