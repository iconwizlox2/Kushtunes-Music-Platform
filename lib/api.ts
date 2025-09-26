import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function requireArtist() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new NextResponse("Unauthorized", { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { email: session.user.email },
    include: { user: true }
  });

  if (!artist) {
    throw new NextResponse("Artist not found", { status: 404 });
  }

  return artist;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new NextResponse("User not found", { status: 404 });
  }

  return user;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { artist: true }
  });

  if (!user || user.artist?.role !== 'admin') {
    throw new NextResponse("Admin access required", { status: 403 });
  }

  return user;
}

export async function requireLabelOwner() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new NextResponse("Unauthorized", { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { email: session.user.email },
    include: { user: true, ownedLabels: true }
  });

  if (!artist || artist.role !== 'label') {
    throw new NextResponse("Label owner access required", { status: 403 });
  }

  return { label: artist, artist };
}

// Error classes
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Response helpers
export function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function onError(error: any) {
  console.error('API Error:', error);
  if (error instanceof BadRequestError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}