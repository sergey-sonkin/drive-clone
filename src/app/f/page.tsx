import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";

export default async function FolderRoot() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    // Redirect to sign-in if not authenticated
    redirect("/sign-in");
  }

  // Get the root folder for the user and redirect to it
  try {
    const rootFolder = await QUERIES.getRootFolderForUser(userId);
    console.log(rootFolder);

    // If we found a root folder, redirect to it
    if (rootFolder) {
      redirect(`/f/${rootFolder.id}`);
    } else {
      // Handle case where no root folder exists yet
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Getting Started</h1>
            <p>Setting up your drive... Please wait a moment.</p>
          </div>
        </div>
      );
    }
  } catch (error) {
    // In Next.js, redirect() throws a NEXT_REDIRECT error that gets caught here
    // We need to check if this is actually a redirect error (which is normal)
    // or a genuine error we should handle

    const errorMessage = String(error);
    if (errorMessage.includes("NEXT_REDIRECT")) {
      // This is just the redirect working as expected
      // We don't need to do anything as Next.js will handle the redirect
      throw error; // Re-throw to let Next.js handle it
    }

    // Only log and show error UI for genuine errors
    console.error("Error finding root folder:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Error</h1>
          <p>Could not find your drive. Please try again later.</p>
        </div>
      </div>
    );
  }
}
