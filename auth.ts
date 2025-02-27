import { NextAuthOptions, Token } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ApplicationRoutes } from "./app/constants/applicationRoutes";
import { useRequestCredentialToken } from "./app/api/apiClient";
import { ApiRoutes } from "./app/api/apiRoutes";
import { ApplicationError } from "./app/constants/applicationError";

// Request token
const requestToken = useRequestCredentialToken();

const API_BASE_URL = ApiRoutes.BASE_URL;

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
        username: {
          label: "Username",
          type: "username",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // If email or password is missing, return null to display an error
        if (!credentials?.username || !credentials.password) {
          // Throw an error to display an error message
          throw new Error("Please provide username and password");
        }

        const token = await requestToken();

        // Call your API to login user
        const res = await fetch(`${API_BASE_URL}${ApiRoutes.UserLogin}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.data.token || ""}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
            credentials: "include", // allow cookies to be sent
          },
          body: JSON.stringify(credentials),
        });

        // Get the response
        const loginResponse = await res.json();
        console.log("🚀 ~ authorize ~ loginResponse:", loginResponse);

        if (
          loginResponse?.errorCode === ApplicationError.InvalidCredentials.Code
        ) {
          throw new Error(ApplicationError.InvalidCredentials.Text);
        }

        if (!res.ok) throw new Error("Invalid credentials");

        if (loginResponse?.token) {
          // Return login response object to be stored in JWT
          return { ...loginResponse };
        }
        return null;
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
      console.log("Sign In Callback", { account, profile });

      if (account?.provider === "google") {
        // Check if user exists in database checking each user's email if it matches the email provided

        // If user exists, return true to allow sign in

        // If user does not exist, create user in database

        return true; // Return true to allow sign in
      }
      return true; // Return true to allow sign in
    },
    async redirect({ url, baseUrl }) {
      return process.env.NEXTAUTH_URL as string;
    },
    // Create and manage JWTs here
    jwt: async ({ token, user, trigger, session }) => {
      console.log("🚀 ~ jwt: ~ user:", user);
      console.log("🚀 ~ jwt: ~ token:", token);
      const customToken = token as Token;

      if (user) {
        return {
          ...customToken,
          id: user.id,
          token: user.token,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // Example: 60 min expiry
        };
      }

      console.log("Date.now(): ", Date.now());
      console.log(
        "customToken.accessTokenExpires: ",
        customToken.accessTokenExpires
      );
      console.log(
        "token expired?: ",
        Date.now() > customToken.accessTokenExpires
      );

      // If the access token is still valid, return it
      if (Date.now() < customToken.accessTokenExpires) {
        return customToken;
      }

      // Access token expired — refresh it
      const refreshedToken = await refreshAccessToken(customToken);
      console.log("🚀 ~ jwt: ~ refreshedToken:", refreshedToken);

      // Ensure the refreshed token is fully passed on
      return refreshedToken;
    },
    // Create and manage sessions here
    session: async ({ session, token }) => {
      console.log("🚀 ~ session: ~ token:", token);
      console.log("🚀 ~ session: ~ session:", session);
      const customToken = token as Token;

      return {
        ...session,
        error: customToken.error,
        user: {
          ...session.user,
          id: customToken.id,
          token: customToken.token,
          refreshToken: customToken.refreshToken,
          accessTokenExpires: customToken.accessTokenExpires,
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

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const res = await fetch(`${ApiRoutes.BASE_URL}${ApiRoutes.RefreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await res.json();

    console.log("🚀 ~ refreshAccessToken ~ refreshedTokens:", refreshedTokens);

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      token: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // Example: 60 min expiry
      refreshToken: refreshedTokens.refreshToken,
    };
  } catch (error) {
    console.error("Refresh token error", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
