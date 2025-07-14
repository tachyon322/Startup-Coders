import { NextResponse } from "next/server";
import { getStartupParticipants } from "@/data/startup";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ startupId: string }> }
) {
  try {
    const { startupId } = await params;
    const participants = await getStartupParticipants(startupId);
    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch participants" },
      { status: 400 }
    );
  }
}