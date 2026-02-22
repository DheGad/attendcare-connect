import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
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
                // Auto-inject a guaranteed mock worker for the Continuous Verification Loop
                let user = await prisma.user.findUnique({ where: { email: 'demo@attendcare.com' } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: 'demo@attendcare.com',
                            name: 'Demo Worker',
                            role: 'worker'
                        }
                    });
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
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
