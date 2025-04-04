"use server";

import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "./db/queries";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

async function safelyGetFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("User not authenticated");
  }
  const file = await QUERIES.getFileById(fileId);
  if (!file || file?.ownerId !== session.userId) {
    throw new Error("File not found");
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

export async function renameFolder(folderId: number, newName: string) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("User not authenticated");
  }
  const folder = await QUERIES.getFolderById(folderId);
  if (!folder || folder.ownerId !== session.userId) {
    throw new Error("Folder not found");
  }
  await MUTATIONS.renameFolder(folderId, newName);
  return { success: true };
}

export async function deleteFile(fileId: number) {
  const file = await safelyGetFile(fileId);

  const utDelete = utapi.deleteFiles(file.utKey);
  const dbDelete = MUTATIONS.deleteFile(fileId);

  await Promise.all([utDelete, dbDelete]);

  return { success: true };
}

export async function createFolder(parentId: number, name: string) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("User not authenticated");
  }
  const folder = await QUERIES.getFolderById(parentId);
  if (!folder || folder.ownerId !== session.userId) {
    throw new Error("Folder not found");
  }

  await MUTATIONS.createFolder({
    folder: {
      name: name,
      parent: parentId,
    },
    userId: session.userId,
  });
  return { success: true };
}

export async function deleteFolder(parentId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("User not authenticated");
  }
  const folder = await QUERIES.getFolderById(parentId);
  if (!folder || folder.ownerId !== session.userId) {
    throw new Error("Folder not found");
  }

  await MUTATIONS.deleteFolder(parentId, session.userId);
  return { success: true };
}
