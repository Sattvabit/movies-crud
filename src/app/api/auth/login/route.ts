import { createTables, getUserByEmail } from "@/lib/database";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    await createTables();
    const body = await req.json();
    const { email, password } = body;
    try {
      const user = await getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, "secret", {
        expiresIn: "1h",
      });
      return NextResponse.json({
        status: 200,
        token: token,
      });
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "something went wrong",
      });
    }
  } else {
    return NextResponse.json({
      status: 500,
      message: "something went wrong",
    });
  }
}
