import { NextRequest, NextResponse } from "next/server";
import { updateStartup } from "@/data/startup";
import { getSession } from "@/lib/auth/getSession";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startupId = (await params).startupId;
    const body = await request.json();
    const { name, description, tags, images } = body;

    // Validate required fields
    if (!name || !description || !tags) {
      return NextResponse.json(
        { error: "Name, description, and tags are required" },
        { status: 400 }
      );
    }

    const updatedStartup = await updateStartup(
      startupId,
      name,
      description,
      tags,
      images || []
    );

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error("Error updating startup:", error);
    
    if (error instanceof Error) {
      if (error.message === "Unauthorized" || error.message === "Only the startup creator can edit the startup") {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message === "Startup not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}