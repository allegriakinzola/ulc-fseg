import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let media;
  try {
    media = await prisma.media.findUnique({ where: { id } });
  } catch {
    media = null;
  }

  if (!media) return new NextResponse("Not found", { status: 404 });

  const buffer = Buffer.from(media.data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
