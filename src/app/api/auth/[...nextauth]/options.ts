import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User as IUser } from "@/models/User";

interface Credentials {
  identifier: string; // email or username
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<keyof Credentials, string> | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        const { identifier, password } = credentials;
        await dbConnect();

        // ✅ Type cast the Mongoose document so TypeScript knows the fields
        const user = (await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        })) as IUser | null;

        if (!user) throw new Error("No user found");
        if (!user.isVerified)
          throw new Error("Please verify your account first");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) throw new Error("Incorrect password");

        // ✅ Only return fields compatible with NextAuth User type
        return {
          id: user.id.toString(), // now TS knows _id exists
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user comes from authorize(), only has id, name, email
        const dbUser = (await UserModel.findById(user.id)) as IUser | null;
        if (dbUser) {
          token._id = dbUser.id.toString();
          token.isVerified = dbUser.isVerified;
          token.isAcceptingMessages = dbUser.isAcceptingMessage;
          token.username = dbUser.username;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
