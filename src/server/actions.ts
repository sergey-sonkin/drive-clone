"use server";

import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "./db/queries";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utapi = new UTApi();

async function safelyGetFile(fileId: number) {
  const session = await auth();
  const file = await QUERIES.getFileById(fileId);
  if (!file) {
    throw new Error("File not found");
  }
  if (file.ownerId !== session.userId) {
    throw new Error("File not found"); // User shouldn't know if file exists
  }
  return file;
}

export async function renameFile(fileId: number, newName: string) {
  const file = await safelyGetFile(fileId);

  const utRenamePromise = utapi.renameFiles({
    fileKey: file.utKey,
    newName: newName,
  });
  const dbRenamePromise = MUTATIONS.renameFile(fileId, newName);
  await Promise.all([utRenamePromise, dbRenamePromise]);

  return { success: true };
}

export async function deleteFile(fileId: number) {
  const file = await safelyGetFile(fileId);

  const utDelete = utapi.deleteFiles(file.utKey);
  const dbDelete = MUTATIONS.deleteFile(fileId);

  await Promise.all([utDelete, dbDelete]);

  return { success: true };
}
