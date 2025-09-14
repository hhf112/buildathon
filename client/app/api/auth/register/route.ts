import { NextRequest, NextResponse } from 'next/server';
import {
  registerHandler,
} from "@/lib/auth";
import { DBConnection } from "@/lib/db";


// register
export async function POST(req: NextRequest) {
  await DBConnection();
  const { email, password, number, access} = await req.json();
  if (!email || !password || !number || !access) NextResponse.json({
    success: false,
    message: "All fields are required"
  }, {status: 400});
  const res = await registerHandler(number, email, password, access);
  return res;
}

