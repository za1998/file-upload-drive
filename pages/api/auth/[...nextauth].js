import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
        },
      },
    }),
  ],
callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token; // <-- Simpan token
    }
    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken; // <-- Kirim ke session
    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
};

// ⬇️ INI YANG WAJIB ADA, supaya NextAuth jalan
export default NextAuth(authOptions);
