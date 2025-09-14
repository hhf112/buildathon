import { sessionContext } from "@/contexts/SessionContextProvider"
import { useContext } from "react";

export function Home() {
  const { user } = useContext(sessionContext);

  return (
    <div className="flex-grow overflow-y-auto bg-neutral-100 p-4">
      <div className="text-2xl bg-white rounded-lg border border-neutral-200 shadow-xl py-4 px-2">
        <p className=" text-green-600/80 font-Georgia font-bold my-1"> Welcome </p>
        <p className=" text-green-600/80 font-Georgia font-bold"> to your Dashboard </p>
        <p className=" text-green-600/80 font-Georgia font-bold">  {user?.number} </p>
      </div>

      <div className="flex w-full bg-white overflow-x-auto">

      </div>
    </div>
  )
}
