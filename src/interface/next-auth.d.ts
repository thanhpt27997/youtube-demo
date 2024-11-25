/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    picture?: string
  }

  interface JWT {
    accessToken?: string;
    picture?: string
  }
}
