import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // 1h
    maxAge: 60 * 60,
  },
  secret: process.env.JWT,
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const body = new FormData();
        body.append("username", username);
        body.append("password", password);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            body: body,
          }
        );

        const dataUser = await response.json();

        if (dataUser.status) {
          return dataUser.data;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
        token.path = user.path;
        token.accessToken = user.accessToken;
        token.pegawaiId = user.pegawaiId;
        token.pegawaiName = user.pegawaiName;
      }

      return token;
    },

    async session({ session, token }: any) {
      delete session.user.email;
      delete session.user.name;
      delete session.user.image;

      if ("id" in token) {
        session.user.id = token.id;
      }

      if ("username" in token) {
        session.user.username = token.username;
      }

      if ("roleId" in token) {
        session.user.roleId = token.roleId;
      }

      if ("roleName" in token) {
        session.user.roleName = token.roleName;
      }

      if ("path" in token) {
        session.user.path = token.path;
      }

      if ("accessToken" in token) {
        session.user.accessToken = token.accessToken;
      }

      if ("pegawaiName" in token) {
        session.user.pegawaiName = token.pegawaiName;
      }

      if ("pegawaiId" in token) {
        session.user.pegawaiId = token.pegawaiId;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
