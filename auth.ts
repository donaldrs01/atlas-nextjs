import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchUser } from "./lib/data";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#ffffff",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      //@ts-ignore
      authorize: async (credentials: Record<"email" | "password", string>) => {
        console.log("🟡 Received login attempt with credentials:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          throw new Error("Missing email or password");
        }

        console.log("🔄 Fetching user from database...");
        const user = await fetchUser(credentials.email);

        if (!user) {
          console.error("User not found:", credentials.email);
          return null;
        }

        console.log("User found:", user);

        if (!user.password) {
          console.error("User does not have a password stored.");
          return null;
        }

        console.log("Comparing passwords...");
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          console.error("Incorrect password for:", credentials.email);
          return null;
        }

        console.log("Login successful for:", credentials.email);
        return user;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirecting after login:", url);
      // Redirect to '/' when logging out
      if (url === baseUrl || url.startsWith(`${baseUrl}/?signedOut=true`)) {
        return baseUrl;
      }
      return `${baseUrl}/ui`;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
