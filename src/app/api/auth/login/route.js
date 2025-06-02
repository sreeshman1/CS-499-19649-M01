import dbConnect from '../../../../lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For setting cookies

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = user.generateJwt();

    // Set token in an HTTP-Only cookie for security
    cookies().set('travlr-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax', // Or 'strict'
    });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 }); // Optionally return token in body too

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}