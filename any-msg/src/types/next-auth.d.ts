import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isAcceptingMessage?: boolean;
    isverified?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isAcceptingMessage?: boolean;
      isverified?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isAcceptingMessage?: boolean;
    isverified?: boolean;
    username?: string;
  }
}
