import { NextRequest, NextResponse } from 'next/server';
import {
  registerHandler,
} from "@/lib/auth";
import { DBConnection } from "@/lib/db";


// register
export async function POST(req: NextRequest) {
  await DBConnection();
  const { email, password, username} = await req.json();
  if (!email || !password || !username) NextResponse.json({
    success: false,
    message: "All fields are required"
  }, {status: 400});
  const res = await registerHandler(username, email, password);
  return res;
}

