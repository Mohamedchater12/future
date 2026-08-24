import type { AdminRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

type AccountType = "admin" | "client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      accountType: AccountType;
      role?: AdminRole;
    };
  }

  interface User {
    id: string;
    accountType: AccountType;
    role?: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType: AccountType;
    role?: AdminRole;
  }
}
