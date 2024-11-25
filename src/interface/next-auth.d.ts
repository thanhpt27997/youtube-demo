/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Thêm thuộc tính accessToken vào Session
  }

  interface JWT {
    accessToken?: string; // Thêm thuộc tính accessToken vào JWT
  }
}
