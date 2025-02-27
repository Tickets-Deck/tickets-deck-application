import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    error: string | null | undefined;
    user: {
      id: string | null | undefined;
      name: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
      username: string | null | undefined;
      idToken: string | null | undefined;
      token: string | null | undefined;
      accessTokenExpires: number;
    };
  }

  interface User {
    id: string | null | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    username: string | null | undefined;
    token: string | null | undefined;
    refreshToken: string | null | undefined;
  }

  interface Token extends JWT {
    id: string;
    token: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
