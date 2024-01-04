"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
) => {
  // Initialize user object
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  // If user already exists, return an error
  if (user) {
    // return error
    return { detail: "User with this email already exist." };
  }

  // If user does not exist, create a new user...

  // Hash the password
  const passwordHash = bcrypt.hashSync(password, 10);

  // Create the user
  const newUser = await prisma.users.create({
    data: {
      email: email,
      password: passwordHash,
      firstName: firstName,
      lastName: lastName,
      phone: phone ?? null
    },
  });

  // return "Successfully created a new user";
  return { detail: "Successfully created a new user", user: newUser };
};
