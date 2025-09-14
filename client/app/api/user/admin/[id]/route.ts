import { NextRequest, NextResponse } from 'next/server';
import { checkTwitter } from "@/lib/user";

export async function GET(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({
    success: false,
    message: "Email not provided"
  }, { status: 400 });
  
  const res = checkTwitter(email);
  return res;
}
