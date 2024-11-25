import { Session } from "next-auth";

export interface CustomSession extends Session {
  user: {
    image?: string;
    name?: string;
    email?: string;
    picture?: string
    accessToken?: string,
  }
}