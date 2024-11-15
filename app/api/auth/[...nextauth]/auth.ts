import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        contactNumber: { label: "Contact Number", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials?.contactNumber || !credentials?.password || !credentials?.userType) {
          throw new Error("Please fill in all required fields");
        }

        let user;
        if (credentials.userType === "admin") {
          user = await prisma.admin.findUnique({
            where: { contactNumber: credentials.contactNumber },
            select: {
              id: true,
              contactNumber: true,
              name: true,
              password: true,
              barangayId: true,
              barangay: {
                select: {
                  name: true,
                },
              },
            },
          });
        } else if (credentials.userType === "donor") {
          user = await prisma.donor.findUnique({
            where: { contactNumber: credentials.contactNumber },
          });
        } else {
          throw new Error("Invalid user type selected");
        }

        if (!user) {
          throw new Error("No user found with this contact number");
        }

        const isPasswordValid = verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        if (credentials.userType === "admin") {
          return {
            id: user.id.toString(),
            contactNumber: user.contactNumber,
            name: user.name,
            userType: credentials.userType,
            brgyName:
              (user as { barangay: { name: string } }).barangay?.name ||
              undefined,
          };
        }

        return {
          id: user.id.toString(),
          contactNumber: user.contactNumber,
          name: user.name,
          userType: credentials.userType,
          brgyName: undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.userType = user.userType;
        token.contactNumber = user.contactNumber;
        token.brgyName = user.brgyName;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        name: token.name,
        userType: token.userType,
        contactNumber: token.contactNumber,
        brgyName: token.brgyName,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
};
