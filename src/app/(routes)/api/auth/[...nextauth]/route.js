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

                    const existingUser = await prisma.user.findUnique({
                        where: { email: profile.email },
                        select: { image: true },
                    });

                    await prisma.user.upsert({
                        where: { email: profile.email },
                        update: {
                            fullName: profile.name,
                            ...(!existingUser?.imagePublicId && {
                                image: profile.picture,
                                imagePublicId: null,
                            }),
                        },
                        create: {
                            email: profile.email,
                            fullName: profile.name,
                            role: "USER",
                            image: profile.picture,
                            imagePublicId: null,
                        },
                    });
                }
                return true;
            } catch {
                return false;
            }
        },

        async jwt({ token, user, trigger }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.image = dbUser.image;
                    token.imagePublicId = dbUser.imagePublicId;
                    token.fullName = dbUser.fullName;
                }
            }

            if (trigger === "update") {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id },
                });
                if (dbUser) {
                    token.image = dbUser.image;
                    token.imagePublicId = dbUser.imagePublicId;
                    token.fullName = dbUser.fullName;
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
            if (token?.imagePublicId) {
                session.user.imagePublicId = token.imagePublicId;
            }
            if (token?.fullName) {
                session.user.name = token.fullName;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
