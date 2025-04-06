import Link from "next/link";
import { FolderX } from "lucide-react";

export default function FolderNotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
      <FolderX className="h-16 w-16 text-gray-400" />
      <h2 className="text-2xl font-semibold text-gray-700">Folder Not Found</h2>
      <p className="max-w-md text-center text-gray-500">
        The folder you're looking for doesn't exist or you don't have permission
        to access it.
      </p>
      <Link
        href="/f/"
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Go to My Drive
      </Link>
    </div>
  );
}
