import { NextRequest, NextResponse } from "next/server";
import { acceptRequest } from "@/data/startup";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const {requestId} = await params;
    await acceptRequest(requestId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to accept request" },
      { status: 400 }
    );
  }
} 