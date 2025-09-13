import Image from "next/image";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  if (!document.cookie.includes("refreshToken")) {
    router.push("/auth");
  }
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1> something</h1>
    </div>
  );
}
