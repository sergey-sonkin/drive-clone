import { auth } from "@clerk/nextjs/server";
import { mockFiles, mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

const form_action = async () => {
  "use server";
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .insert(folders_table)
    .values({ name: "root", ownerId: user.userId, parent: null })
    .execute();

  const rootFolderId = Number(result.lastInsertRowid);

  const insertableFolders = mockFolders.map((folder) => ({
    ownerId: user.userId,

    name: folder.name,
    parent: rootFolderId,
  }));

  const insertableFiles = mockFiles.map((file) => ({
    ownerId: user.userId,

    name: file.name,
    size: file.size,
    url: file.url,
    parent: rootFolderId,
  }));

  await db.insert(folders_table).values(insertableFolders);
  await db.insert(files_table).values(insertableFiles);
};

export default function Sandbox() {
  return (
    <div>
      <form action={form_action}>
        <button type="submit">Create file</button>
      </form>
    </div>
  );
}
