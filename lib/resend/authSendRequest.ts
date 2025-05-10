import { EmailTemplate } from "@/components/resend/EmailTemplate";
import getResend from "./getResend";

interface VerificationRequestParams {
    email: string;
    provider: {
        from: string;
    };
    url: string;
}

export async function sendVerificationRequest(
    params: VerificationRequestParams
) {
    const resend = getResend();

    const { url, email } = params; // Check if email is being set

    try {
        const { data, error } = await resend.emails.send({
            from: "Style32 <noreply@startup.style32.online>",
            to: [email],
            subject: `STARTUP`,
            react: EmailTemplate({ magicLink: url }) as React.ReactElement,
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }
        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}