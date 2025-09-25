import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    callbacks: {
        async signIn({ account, profile }) {
            try {
                if (account.provider === "google") {
                    if (!profile.email_verified) return false;

                    await prisma.user.upsert({
                        where: { email: profile.email },
                        update: {
                            fullName: profile.name,
                            image: profile.picture,
                        },
                        create: {
                            email: profile.email,
                            fullName: profile.name,
                            role: "USER",
                            image: profile.picture,
                        },
                    });
                }
                return true;
            } catch {
                return false;
            }
        },

        async jwt({ token, user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.image = dbUser.image;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            if (token?.image) {
                session.user.image = token.image;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
