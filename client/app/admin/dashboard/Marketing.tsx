export default function Marketing() {
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
        <p className="text-sm text-neutral-700"> What would you like to promote? </p>
        <textarea
          className="w-full  rounded-sm border p-1 text-neutral-700 resize-none text-sm text-neutral-200m min-h-1/2 border-neutral-400"
          placeholder="Enter your prompt here" />
        <button
          className="py-1 shadow rounded-lg bg-blue-950 text-white w-full cursor-pointer">
          🪄 Generate campaign
        </button>
      </div>
    </div>
  );
}
