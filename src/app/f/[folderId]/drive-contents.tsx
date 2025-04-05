"use client";

import { ChevronRight, Upload } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { NewFolderButton } from "./new-folder-button";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const rootId = props.parents[0]?.id;
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex h-10 items-center justify-between">
          {/* Breadcrumbs - Left side */}
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Link
              href={`/f/${rootId}`}
              className={`hover:text-blue-400 ${
                props.currentFolderId === rootId
                  ? "font-medium text-gray-100"
                  : ""
              }`}
            >
              My Drive
            </Link>
            {props.parents.length > 0 &&
              props.parents.slice(1).map((folder, index, slicedParents) => {
                const isCurrentFolder = index === slicedParents.length - 1;
                return (
                  <div key={folder.id} className="flex items-center">
                    <ChevronRight className="mx-2 size-4 text-gray-500" />
                    <Link
                      href={`/f/${folder.id}`}
                      className={`hover:text-blue-400 ${
                        isCurrentFolder ? "font-medium text-gray-100" : ""
                      }`}
                    >
                      {folder.name}
                    </Link>
                  </div>
                );
              })}
          </div>

          {/* Right side - Create folder, Upload file, Auth */}
          <div className="flex h-8 items-center gap-2">
            <NewFolderButton folderId={props.currentFolderId} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-100 hover:bg-gray-700">
                    <UploadButton
                      endpoint="driveUploader"
                      onClientUploadComplete={() => {
                        navigate.refresh();
                      }}
                      input={{ folderId: props.currentFolderId }}
                      className="ut-button:h-8 ut-button:w-8 ut-button:p-0 ut-button:bg-transparent ut-button:flex ut-button:items-center ut-button:justify-center ut-button:text-gray-100"
                      appearance={{
                        button: "p-0",
                        allowedContent: "hidden",
                        container: "w-auto",
                      }}
                      content={{
                        button({ ready }) {
                          return <Upload className="size-4" />;
                        },
                      }}
                    />
                    <span className="sr-only">Upload New File</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload New File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-100 hover:bg-gray-700"
                >
                  <span className="text-xs">Sign in</span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder, index) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                isLast={
                  index === props.folders.length - 1 && props.files.length === 0
                }
              />
            ))}
            {props.files.map((file, index) => (
              <FileRow
                key={file.id}
                file={file}
                isLast={index === props.files.length - 1}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
