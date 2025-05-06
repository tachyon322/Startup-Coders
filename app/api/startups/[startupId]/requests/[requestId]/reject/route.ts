import { NextRequest, NextResponse } from "next/server";
import { rejectRequest } from "@/data/startup";

export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    await rejectRequest(params.requestId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reject request" },
      { status: 400 }
    );
  }
} 