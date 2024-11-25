import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid profile email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expires = Date.now() + 3600 * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
