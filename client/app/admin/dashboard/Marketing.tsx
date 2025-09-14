import { setRequestMeta } from "next/dist/server/request-meta";
import { useRef, useState } from "react";
export default function Marketing() {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  const promptRef = useRef<HTMLTextAreaElement>(null);
  async function generateCampaign() {
    if (!promptRef.current) return;
    const prompt = promptRef.current?.value;
    setGenerating(true);

    const post = await fetch("/api/marketing", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        news: prompt,
      }),
    });

    const postJSON = await post.json();
    setGenerating(false);
    setResult(postJSON.ad);
    setGenerated(true);
  }

  return (
    <div className="flex-grow flex flex-col bg-neutral-100">
      <div className="mt-50 p-2 mx-2.5">
        <p className="text-2xl font-Georgia text-neutral-700">
          AI Marketing Assistant
        </p>
        <p className="text-sm font-Georgia text-neutral-700">
          Create personalized marketing campaigns for your business.
        </p>
      </div>

      <div className="mx-2.5 flex flex-col bg-white p-2 rounded-sm justify-between gap-1 min-h-1/4">
        <p className="text-sm text-neutral-700"> {generating ? "Working on it ... " : "Any latest news you would like to add ?"}</p>
        {generated && <p className="text-sm text-neutral-700"> {result} </p>}

        {!generated && <textarea
          ref={promptRef}
          className="w-full  rounded-sm border p-1 text-neutral-700 resize-none text-sm text-neutral-200m min-h-1/2 border-neutral-400"
          placeholder="Enter your prompt here" />
        }
        <button
          className="py-1 shadow rounded-lg bg-blue-950 text-white w-full cursor-pointer"
          onClick={() => {
            if (generated) {
              setGenerated(false);
              setResult("");
            }
            else generateCampaign()
          }}>
          🪄 Generate campaign
        </button>
      </div>
    </div>
  );
}
