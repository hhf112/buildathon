import { NextResponse } from 'next/server';
import { generate_advertisement } from "@/lib/marketing";

export async function POST(req: Request) {
  console.log("here");
  const { news } = await req.json();

  const res = await generate_advertisement(news);
  return res;
}
