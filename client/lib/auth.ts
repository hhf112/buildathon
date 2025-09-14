import monogoose from 'mongoose';
import bcrypt from "bcrypt"
import { User, UserType } from '@/models/user.model';
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';


function generateAccessToken(user: {
  number: string,
  email: string
}) {
  return jwt.sign({
    number: user.number,
    email: user.email
  }, process.env.JWT_SECRET as string, { expiresIn: "4h" })
}

function generateRefreshToken(user: {
  number: string,
  email: string
}) {
  return jwt.sign({
    number: user.number,
    email: user.email
  }, process.env.REFRESH_SECRET as string)
}



export async function loginHandler(email: string, password: string) {
  let user = await User.findOne({ email: email }).exec();
  if (!user || user === null)
    return NextResponse.json({
      success: false,
      message: "user not found with this email"
    }, { status: 400 });

  try {
    const result = await bcrypt.compare(password, user.password);
    if (!result)
      return NextResponse.json({
        success: false,
        message: "Invalid number or password"
      }, { status: 401 });

    const access = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user = await User.findByIdAndUpdate(user._id, { jwt_refreshToken: refreshToken }, { new: true });


    const res = NextResponse.json({
      success: true,
      accessToken: access,
      refreshToken: refreshToken,
      user: user,
    }, { status: 200 });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    })

    return res;
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

export const registerHandler = async (number: string, password: string, email: string, access: number) => {
  const hashingRounds = 12;
  try {
    const hashedPassword = await bcrypt.hash(password, hashingRounds);
    const userResponse = {
      number: number,
      password: hashedPassword,
      email: email,
      jwt_refreshToken: null,
      access: access
    }

    await User.create(userResponse);

    return NextResponse.json({
      success: true,
      user: userResponse,
    }, { status: 200 });

  } catch (err: any) {
    console.log(err);
    if (err.code === 11000) { // duplicate key error
      return NextResponse.json({
        success: false,
        message: "Email already in use.",
      }, { status: 400 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Internal server error.",
      }, { status: 500 });
    }
  }
}

export const logoutHandler = async (refreshToken: string) => {
  jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
    if (err) {
      return NextResponse.json({
        success: false,
        message: "Invalid refresh token"
      }, { status: 401 });
      return;
    }

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        return NextResponse.json({
          success: false,
          message: "Invalid refresh token"
        }, { status: 401 });
        return;
      }

      await User.updateOne({ _id: result._id }, { jwt_refreshToken: null });

      const res = NextResponse.json({
        success: true,
      }, { status: 200 });

      res.cookies.set("refreshToken", "", {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
      });


    } catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: "Internal server error"
      });
    }
  })

}

export const sessionHandler = async (refreshToken: string) => {
  jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
    if (err) {
      return NextResponse.json({
        success: false,
        message: "Invalid refresh token"
      }, { status: 401 });
      return;
    }

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        return NextResponse.json({
          success: false,
          message: "Refresh token not found"
        }, { status: 401 });
        return;
      }

      return NextResponse.json({
        success: true,
        login: (refreshToken) ? true: false,
        user: result,
      }, { status: 200 });
    }
    catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: "Internal server error"
      }, { status: 500 });
    }
  });
}

export const tokenHandler = async (refreshToken: string) => {
  jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
    if (err) {
      return NextResponse.json({
        success: false,
        message: "Invalid refresh token"
      }, { status: 401 });
      return;
    }

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        return NextResponse.json({
          success: false,
          message: "Refresh token not found"
        }, { status: 401 });
        return;
      }

      const accessToken = generateAccessToken(result);

      return NextResponse.json({
        success: true,
        accessToken: accessToken,
        user: result,
      }, { status: 200 });

    } catch (err) {
      console.error(err);
      return NextResponse.json({
        success: false,
        message: "Internal server error"
      }, { status: 500 });
    }
  })
}
