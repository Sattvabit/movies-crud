import { addUser, createTables } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    await createTables();
    const body = await req.json();
    const { email, password } = body;
    try {
      await addUser(email, password);
      return NextResponse.json({
        status: 200,
        message: "User registered successfully",
      });
    } catch (error: any) {
      if (error.errno === 19) {
        return NextResponse.json({
          status: 500,
          message: "User already exists",
        });
      } else {
        return NextResponse.json({
          status: 500,
          message: "User registration failed",
        });
      }
    }
  } else {
    return NextResponse.json({
      status: 500,
      message: "User registration failed",
    });
  }
}
