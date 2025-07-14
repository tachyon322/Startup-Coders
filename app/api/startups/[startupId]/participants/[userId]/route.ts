import { NextResponse } from "next/server";
import { removeParticipantFromStartup } from "@/data/startup";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ startupId: string; userId: string }> }
) {
  try {
    const { startupId, userId } = await params;
    await removeParticipantFromStartup(startupId, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing participant:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove participant" },
      { status: 400 }
    );
  }
}