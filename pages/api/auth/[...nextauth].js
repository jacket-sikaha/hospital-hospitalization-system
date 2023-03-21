import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { verifyPassword } from "../../../lib/auth";
import { usersCollection } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await usersCollection({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("No user found!");
        }
        console.log(user);
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        return { email: user.email };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
