"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import { sessionContext, SessionContextProvider } from "@/contexts/SessionContextProvider";

export default function Home() {
  const router = useRouter();
  const { setUser, setSessionToken } = useContext(sessionContext);

  useEffect(() => {
    (async () => {
      const resp = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      const resp_json = await resp.json();
      if (resp_json.accessToken) {
        setSessionToken(resp_json.accessToken);
        setUser(resp_json.user);
        if (resp_json.user.access == 0) router.push('/admin');
        else router.push('/dashboard');
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-screen">

      <div className="flex justify-between w-full items-center bg-white border border-neutral-400 py-0.5 px-1 h-12">
        <div className="inline-block ml-2 h-full">
          <img src="/brokerboots.jpg" className="max-h-full object-contain" />
        </div>


        <button
          className="rounded-lg p-2 shadow-2xl bg-green-700 text-white  font-serif"
          onClick={() => router.push('/auth')}>
          Create an Account!/Login
        </button>
      </div>
    </div>
  );
}
