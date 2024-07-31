"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import { Provider } from "react-redux";
import store from "../store/store";
import RequireAuth from "@/components/RequireAuth/RequireAuth";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <RequireAuth>
          {loading ? (
            <div className="flex h-screen items-center justify-center text-white">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <Provider store={store}>
              {children}
              <>
                <Footer />
              </>
            </Provider>
          )}
        </RequireAuth>
      </body>
    </html>
  );
}
