"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect } from "react";  

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!document.cookie.includes("refreshToken")) {
      router.push("/auth");
    }
  }, [router]);
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1> something</h1>
    </div>
  );
}
