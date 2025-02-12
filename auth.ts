import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compileAccountCreationTemplate, sendMail } from "./lib/mail";
import { ApplicationRoutes } from "./app/constants/applicationRoutes";
import { StorageKeys } from "./app/constants/storageKeys";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Set max age to 24 hours
    maxAge: 24 * 60 * 60,
    // Update jwt every 23 hours
    updateAge: 20 * 60 * 60,
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
        // If email or password is missing, return null to display an error
        if (!credentials?.email || !credentials.password) {
          // Throw an error to display an error message
          throw new Error("Please provide email and password");
        }

        // Check that password matches
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Throw an error to display an error message
          throw new Error(
            "Incorrect password. Please check your password and try again."
          );
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
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`, // Make sure this matches the URI in the Google Developer Console
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      // console.log("Sign In Callback", { account, profile });

      if (account?.provider === "google") {
        // Check if user exists in database checking each user's email if it matches the email provided
        const user = await prisma.users.findUnique({
          where: {
            email: profile?.email,
          },
        });

        // If user exists, return true to allow sign in
        if (user) {
          // Update emailVerified to true
          await prisma.users.update({
            where: {
              id: user.id,
            },
            data: {
              emailVerified: true,
            },
          });

          return true; // Return true to allow sign in
        }

        // If user does not exist, create user
        await prisma.users.create({
          data: {
            email: profile?.email as string,
            firstName: profile?.name?.split(" ")[0] as string,
            lastName: profile?.name?.split(" ")[1] as string,
            password: "google-signup-no-password",
            profilePhoto: profile?.picture as string,
            emailVerified: true,
          },
        });

        // Send email to the subscriber
        await sendMail({
          to: profile?.email as string,
          name: "Account Created",
          subject: "Welcome to Ticketsdeck",
          body: compileAccountCreationTemplate(
            `${profile?.name?.split(" ")[0]} ${profile?.name?.split(" ")[1]}`
          ),
        });

        return true; // Return true to allow sign in
      }
      return true; // Return true to allow sign in
    },
    async redirect({ url, baseUrl }) {
      return process.env.NEXTAUTH_URL as string;
    },
    // Create and manage JWTs here
    jwt: async ({ token, user, trigger, session }) => {
      // console.log("JWT Callback", { token, user, trigger, session });

      // Check prisma for user with email gotten in token
      const exisitingUser = await prisma.users.findUnique({
        where: {
          email: token.email as string,
        },
      });

      // If user exists, return user id in JWT so it will be accessible in the session
      if (exisitingUser) {
        return {
          ...token,
          id: exisitingUser.id,
        };
      } else if (user) {
        const u = user as unknown as any;

        // Return user info so it will be accessible in the session
        return {
          ...token,
          id: u.id,
        };
      }

      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
          name: session.user.name,
          email: session.user.email,
        };
      }

      return token;
    },
    // Create and manage sessions here
    session: async ({ session, token }) => {
      // console.log("Session Callback", { session, token });

      // Fetch user details from database
      const user = await prisma.users.findUnique({
        where: {
          id: token.id as string,
        },
      });
      // console.log("🚀 ~ session: ~ user:", user);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
          idToken: token.idToken,
          image: user?.profilePhoto,
          name: user?.firstName + " " + user?.lastName,
          email: user?.email,
          //   image: token.image as string ?? user?.profilePhoto,
          //   name: token.name,
          //   email: token.email,
        },
      };
    },
  },
  events: {
    async signIn(message) {
    //   console.log("Sign In Event", { message });
    },
    async signOut(message) {
      // Delete the session cookie
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Delete the new user email from session storage
      sessionStorage.removeItem(StorageKeys.NewlyCreatedUserEmail);

      // console.log("Sign Out Event", { message });
    },
    // async createUser(message) {
    //   console.log("Create User Event", { message });
    // },
    // async linkAccount(message) {
    //   console.log("Link Account Event", { message });
    // },
    // async session(message) {
    //   console.log("Session Event", { message });
    // },
  },
  pages: {
    signIn: ApplicationRoutes.SignIn,
  },
};
