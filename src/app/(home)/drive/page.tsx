import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();
  if (!session.userId) {
    return redirect("/sign-in");
  }
  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);
  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";
          const session = await auth();
          if (!session.userId) {
            return redirect("/sign-in");
          }
          const rootFolderId = await MUTATIONS.createFolder({
            folder: { name: "root", parent: null },
            userId: session.userId,
          });
          await MUTATIONS.createFolder({
            folder: { name: "Pictures", parent: rootFolderId },
            userId: session.userId,
          });
          await MUTATIONS.createFolder({
            folder: { name: "Songs", parent: rootFolderId },
            userId: session.userId,
          });
          await MUTATIONS.createFolder({
            folder: { name: "Documents", parent: rootFolderId },
            userId: session.userId,
          });
          return redirect("/f/${rootFolderId}");
        }}
      >
        <Button>Create new Drive</Button>
      </form>
    );
  }

  return redirect(`/f/${rootFolder.id}`); // Redirect to the root folder
}
