import { NextRequest, NextResponse } from 'next/server';
import {
  loginHandler,
  logoutHandler,
  tokenHandler,
  sessionHandler
} from "../../../lib/auth";
import { DBConnection } from "@/lib/db";


// login
export async function POST(req: NextRequest) {
  await DBConnection();
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({
      success: false,
      message: "No email or password found"
    }, { status: 400 });
  }
  const res = await loginHandler(email, password);
  return res;
}

// token refresh
export async function GET(req: NextRequest) {
  await DBConnection();
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      message: "No refresh token found"
    }, { status: 401 });
  }

  const res = await sessionHandler(refreshToken);
  return NextResponse.json(res);
}

// logout
export async function DELETE(req: NextRequest) {
  await DBConnection();
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      message: "No refresh token found"
    }, { status: 401 });
  }


  const res = await logoutHandler(refreshToken);
  return NextResponse.json(res);
}

