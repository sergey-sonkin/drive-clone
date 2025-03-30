"use server";

import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "./db/queries";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utapi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  const file = await QUERIES.getFileById(fileId);
  if (!file) {
    throw new Error("File not found");
  }
  if (file.ownerId !== session.userId) {
    throw new Error("File not found"); // User shouldn't know if file exists
  }
  const utDelete = utapi.deleteFiles(file.utKey);
  const dbDelete = MUTATIONS.deleteFile(fileId);

  await Promise.all([utDelete, dbDelete]);

  // // Refresh the page for user without having to calc route or do another request
  // const c = await cookies();
  // c.set("force-refresh", JSON.stringify(Math.random()));
  return { success: true };
}
