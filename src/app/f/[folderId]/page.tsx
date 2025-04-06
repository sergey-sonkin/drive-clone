import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FolderNotFound from "./not-found";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    // Redirect to sign-in if not authenticated
    redirect("/sign-in");
  }

  const params = await props.params; // Indicates this is a dynamic route

  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <FolderNotFound />;
  }

  try {
    const [files, folders, parents] = await Promise.all([
      QUERIES.getFiles(parsedFolderId),
      QUERIES.getFolders(parsedFolderId),
      QUERIES.getAllParentsForFolder(parsedFolderId),
    ]);

    // Also verify that the user has access to this folder
    // This prevents users from accessing folders that don't belong to them
    if (parents.length > 0 && parents[0]?.ownerId !== userId) {
      return <FolderNotFound />;
    }

    return (
      <DriveContents
        files={files}
        folders={folders}
        parents={parents}
        currentFolderId={parsedFolderId}
      ></DriveContents>
    );
  } catch (error) {
    console.error("Error loading folder:", error);
    return <FolderNotFound />;
  }
}
