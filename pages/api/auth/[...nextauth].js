import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { verifyPassword } from "../../../lib/auth";
import { usersCollection, usersIsExist } from "../../../lib/db";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/MongoDBAdapte";
export default NextAuth({
  session: {
    jwt: true,
    maxAge: 5 * 60, // 1min
  },
  // adapter: MongoDBAdapter(clientPromise, {
  //   // databaseName: "hhs_auth",
  //   databaseName: "hhs",
  // }),
  providers: [
    CredentialsProvider({
      id: "passwordLogin",
      name: "passwordLogin",
      async authorize(credentials) {
        console.log("credentials", credentials);
        const user = await usersCollection({
          phone: credentials.username,
        });
        if (!user) {
          throw new Error("No user found!");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        // if (!isValid) {
        //   throw new Error("Could not log you in!");
        // }
        delete user.password;
        console.log(111, user);

        return user;
      },
    }),
    CredentialsProvider({
      id: "emailLogin",
      name: "emailLogin",
      async authorize(credentials) {
        const user = await usersIsExist({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("No user found!");
        }
        const isValid = await verifyPassword(
          credentials.captcha,
          credentials.code
        );

        if (!isValid) {
          throw new Error("验证码错误!");
        }
        delete user.password;
        // console.log(111, user);

        return user;
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  callbacks: {
    //   async signIn({ user, account, profile, email, credentials }) {
    //     console.log(account, profile, email, credentials);
    //     // email.verificationRequest =>{ verificationRequest: true }
    //     // 电子邮件登录期间的第一个通话中，将包括一个属性verificationRequest: true表示在验证请求流中触发它。
    //     // 当用户单击登录链接后调用回调时，此属性将不存在。
    //     if (account.type === "email" && email) {
    //       const existingUser = await usersIsExist({ email: user.email });
    //       console.log(22222);
    //       if (existingUser) {
    //         return true;
    //       } else {
    //         // Return false to display a default error message
    //         return false;
    //         // Or you can return a URL to redirect to:
    //         // return '/unauthorized'
    //       }
    //     }
    //     return true; // 用户名登陆则一切正常判断
    //   },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, user, token }) {
      // console.log("user12", user);
      // console.log("token12", token);
      // console.log("session12", session);
      if (session?.user && token) {
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
