import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
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
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.picture = profile.picture;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.picture) {
                session.user.image = token.picture;
            }
            return session;
        },
    },
});

export { authOptions as GET, authOptions as POST };
