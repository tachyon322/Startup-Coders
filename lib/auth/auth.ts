import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma"
import { magicLink } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            }
        }
    },
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }) => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                    // Construct a URL to our verify page with the token
                    const magicLinkUrl = `${baseUrl}/verify?token=${token}`;
                    
                    await fetch(`${baseUrl}/api/send-email`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            url: magicLinkUrl,
                        }),
                    });
                } catch (error) {
                    console.error("Failed to send magic link:", error);
                }
            },
            expiresIn: 300, // 5 minutes
        }),
    ],
});