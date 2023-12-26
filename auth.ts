import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // Would be stored for 30 seconds
    updateAge: 15 * 60, // How frequently the tokem would be updated -  every day
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Log credentials
        console.log("credentials gotten: ", credentials);

        // If email or password is missing, return null to display an error
        if (!credentials?.email || !credentials.password) {
          console.log("Email or password is missing!");
          // Return null to display form error that credentials are not correct
          return null;
        }

        // Check if user exists in database checking each user's email if it matches the email provided
        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        // Check that password matches
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user object to be stored in JWT
        return {
          id: user.id + "",
          email: user.email,
          name: user.firstName + " " + user.lastName,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: "http://localhost:9000/api/auth/callback/google", // Make sure this matches the URI in the Google Developer Console
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      }
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    // Create and manage JWTs here
    jwt: ({ token, user, trigger, session }) => {
      console.log("JWT Callback", { token, user });

      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user) {
        const u = user as unknown as any;

        // Return user id and randomKey in JWT so it will be accessible in the session
        return {
          ...token,
          //   accessToken: token.accessToken,
          id: u.id,
        };
      }
      return token;
    },
    // Create and manage sessions here
    session: ({ session, token }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
          idToken: token.idToken,
        },
      };
    },
  },
}