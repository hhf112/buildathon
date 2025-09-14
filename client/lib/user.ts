import { User } from "@/models/user.model"
import { NextResponse } from "next/server";

export const checkTwitter = async (email: string) => {
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found"
    }, { status: 400 });
  }

  if (user) return NextResponse.json({
    success: true,
    twitter: (user.twitter ? true : false),
  }, { status: 200 });
}
