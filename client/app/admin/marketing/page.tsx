"use client";
import { useState, useEffect, useContext } from "react";
import { sessionContext } from "@/contexts/SessionContextProvider";

export default function AIMarketing() {
  const { user } = useContext(sessionContext);
  const [signin, setSignin] = useState(false);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`api/user/admin/${user?.email}`)
      const resp_json = await resp.json();
      if (!resp_json.twitter) setSignin(true);
    })();

    return () => {
      return
    }
  }, [])


  return (
    <div className="flex flex-col h-screen bg-neutral-100">

      {/*top bar*/}
      <div className="flex items-center bg-white justify-between border border-neutral-400 py-2 px-2 h-auto">
        <div className="w-1/4 top-0 left-0 inline-block">
          <img src="/turtlemint-logo-1.webp" className="w-full h-full object-fill" />
        </div>

        <h1 className="text-sm"> notif and pfp whatever  </h1>
      </div>


      {signin ? (
        <div>
        </div>
      ) : (<>
        <div className="mt-50 p-2 mx-2.5">
          <p className="text-2xl font-Georgia text-neutral-700">
            AI Marketing Assistant
          </p>
          <p className="text-sm font-Georgia text-neutral-700">
            Create personalized marketing campaigns for your business.
          </p>
        </div>

        <div className="mx-2.5 flex flex-col bg-white p-2 rounded-sm justify-between gap-1 min-h-1/4">
          <p className="text-sm text-neutral-700"> What would you like to promote? </p>
          <textarea
            className="w-full  rounded-sm border p-1 text-neutral-700 resize-none text-sm text-neutral-200m min-h-1/2 border-neutral-400"
            placeholder="Enter your prompt here" />
          <button
            className="py-1 shadow rounded-lg bg-blue-950 text-white w-full cursor-pointer">
            🪄 Generate campaign
          </button>
        </div>
      </>)}
    </div>
  );
}
