import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authCookieNames, scopedCookieOptions } from "@/lib/auth-cookies";

// 1 year: sessions must persist until the user explicitly logs out, not expire
// on their own after a short period of inactivity.
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

export const adminAuthOptions: AuthOptions = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  jwt: { maxAge: SESSION_MAX_AGE },
  cookies: {
    sessionToken: { name: authCookieNames.admin.sessionToken, options: scopedCookieOptions() },
    callbackUrl: { name: authCookieNames.admin.callbackUrl, options: scopedCookieOptions() },
    csrfToken: { name: authCookieNames.admin.csrfToken, options: scopedCookieOptions() },
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!isValid) return null;

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          accountType: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const clientAuthOptions: AuthOptions = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  jwt: { maxAge: SESSION_MAX_AGE },
  cookies: {
    sessionToken: { name: authCookieNames.client.sessionToken, options: scopedCookieOptions() },
    callbackUrl: { name: authCookieNames.client.callbackUrl, options: scopedCookieOptions() },
    csrfToken: { name: authCookieNames.client.csrfToken, options: scopedCookieOptions() },
  },
  pages: {
    signIn: "/espace-client/connexion",
  },
  providers: [
    CredentialsProvider({
      id: "client-credentials",
      name: "client-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Client.email isn't a unique DB constraint (legacy leads can share an
        // address before conversion), so only match a row that has actually
        // claimed a portal account.
        const client = await prisma.client.findFirst({
          where: { email: credentials.email, passwordHash: { not: null } },
        });
        if (!client || !client.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, client.passwordHash);
        if (!isValid) return null;

        return {
          id: client.id,
          name: client.name,
          email: client.email,
          accountType: "client",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
      }
      return session;
    },
  },
};
