import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ 
      data: { 
        email, 
        name: name || null, 
        passwordHash: hash 
      } 
    });
    
    await prisma.artist.create({ 
      data: { 
        userId: user.id, 
        name: name || email.split("@")[0], 
        legalName: name || email.split("@")[0],
        email,
        country: "GB"
      } 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
