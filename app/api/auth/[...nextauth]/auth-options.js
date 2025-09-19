import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        try {
          const res = await fetch("https://wiqiapi.testenvapp.com/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          // API response format:
          // { status, success, message, data: { id, email, api_token } }

          return {
            id: data.data.id,
            email: data.data.email,
            token: data.data.api_token, // keep api_token
          };
        } catch (err) {
          console.error("Login error:", err);
          throw new Error("Something went wrong while logging in");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.api_token = user.token; // persist API token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.api_token = token.api_token; // expose API token to client
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default authOptions;
