import { NextRequest, NextResponse } from 'next/server';

import { tokenHandler } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      message: "No refresh token found"
    }, { status: 401 });
  }

  const res = await tokenHandler(refreshToken);
  return res;
}
