import { EmailTemplate } from "@/components/resend/EmailTemplate";
import getResend from "@/lib/resend/getResend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, url } = body;
    
    if (!email || !url) {
      return NextResponse.json(
        { error: "Email and URL are required" }, 
        { status: 400 }
      );
    }
    
    const resend = getResend();
    
    const { data, error } = await resend.emails.send({
      from: "Startup Coders <noreply@style32.online>",
      to: [email],
      subject: "Ссылка для входа в Startup Coders",
      react: EmailTemplate({ magicLink: url }) as React.ReactElement,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }
    
    console.log("Magic link email sent successfully to:", email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
} 