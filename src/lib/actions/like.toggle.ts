"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function toggleLike(postId : string) {
  const { userId } = await auth(); // Clerk's user ID
  if (!userId) throw new Error("You must be logged in to like an article");
  


  // Ensure the user exists in the database
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User does not exist in the database.");
  }

  // Check if the user has already liked the article
  const existingLike = await prisma.like.findFirst({
    where: { postId, userId: user.id }, // Use `user.id`, not `clerkUserId`
  });

  if (existingLike) {
    // Unlike the article
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    // Like the article
    await prisma.like.create({
      data: { postId, userId: user.id },
    });
  }


}