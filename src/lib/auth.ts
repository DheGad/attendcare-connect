import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    // Stripped Prisma Adapter to prevent Vercel 500 errors on serverless read-only file systems
    secret: process.env.NEXTAUTH_SECRET || "production_fallback_secret_key_12345",
    // Force a valid URL in Vercel to prevent 500 router errors during sign-in
    ...(!process.env.NEXTAUTH_URL && {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    }),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: 'Demo Access',
            credentials: {
                password: { label: "Password (leave blank for demo)", type: "password" }
            },
            async authorize() {
                // Return a mock user directly, bypassing the read-only SQLite database in Vercel Edge
                return {
                    id: "demo-worker-123",
                    name: 'Demo Worker',
                    email: 'demo@attendcare.com',
                    role: 'worker'
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role || "worker"; // Default role
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-expect-error: NextAuth session type augmentation mismatch
                session.user.id = token.id;
                // @ts-expect-error: NextAuth session type augmentation mismatch
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        // Note: We use the existing App Shell for sign-in so we do not direct to a custom page yet unless needed
        // signIn: '/login'
    }
};
