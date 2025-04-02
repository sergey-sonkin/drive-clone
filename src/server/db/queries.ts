import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const QUERIES = {
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));
      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },

  getFolderById: async function (folderId: number) {
    return await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId))
      .get();
  },

  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },

  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },

  getFileById: async function (fileId: number) {
    return await db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.id, fileId))
      .get();
  },

  getRootFolderForUser: async function (userId: string) {
    return await db
      .select()
      .from(foldersSchema)
      .where(
        and(isNull(foldersSchema.parent), eq(foldersSchema.ownerId, userId)),
      )
      .get();
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
      type: string;
    };
    userId: string;
    utKey: string;
  }) {
    console.log("Creating file with input:", input);
    return await db
      .insert(filesSchema)
      .values({ ...input.file, ownerId: input.userId, utKey: input.utKey });
  },

  createFolder: async function (input: {
    folder: { name: string; parent: number | null };
    userId: string;
  }) {
    const result = await db
      .insert(foldersSchema)
      .values({
        name: input.folder.name,
        parent: input.folder.parent,
        ownerId: input.userId,
      })
      .execute();
    return Number(result.lastInsertRowid);
  },

  deleteFile: async function (fileId: number) {
    return await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
  },

  deleteUsersFile: async function (fileId: number, userId: string) {
    return await db
      .delete(filesSchema)
      .where(and(eq(filesSchema.id, fileId), eq(filesSchema.ownerId, userId)));
  },

  renameFile: async function (fileId: number, newName: string) {
    return await db
      .update(filesSchema)
      .set({ name: newName })
      .where(eq(filesSchema.id, fileId));
  },

  renameFolder: async function (folderId: number, newName: string) {
    return await db
      .update(foldersSchema)
      .set({ name: newName })
      .where(eq(foldersSchema.id, folderId));
  },
};
