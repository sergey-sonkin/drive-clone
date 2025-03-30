import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

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
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: { name: string; size: number; url: string; parent: number };
    userId: string;
    utKey: string;
  }) {
    console.log("Creating file with input:", input);
    return await db
      .insert(filesSchema)
      .values({ ...input.file, ownerId: input.userId, utKey: input.utKey });
  },

  deleteFile: async function (fileId: number) {
    return await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
  },

  deleteUsersFile: async function (fileId: number, userId: string) {
    return await db
      .delete(filesSchema)
      .where(and(eq(filesSchema.id, fileId), eq(filesSchema.ownerId, userId)));
  },
};
