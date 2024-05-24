import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Moralis from 'moralis';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Magic',
      credentials: {
        message: { label: "Message", type: "text", placeholder: "0x0" },
        signature: { label: "Signature", type: "text" }
      },
      authorize: async (credentials) => {
        try {
          const { message, signature } = credentials;
          const user = await Moralis.Cloud.run("verifyUser", { message, signature });
          return user ? user : null;
        } catch (e) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});
