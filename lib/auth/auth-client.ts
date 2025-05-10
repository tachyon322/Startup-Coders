import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [
        magicLinkClient()
    ],
    fetchOptions: {
        // Adding custom fetch options to ensure queries are properly passed
        credentials: 'include',
    }
})