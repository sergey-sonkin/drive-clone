import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

const f = createUploadthing();

export const ourFileRouter = {
  driveUploader: f({
    blob: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ folderId: z.number() }))

    .middleware(async ({ input }) => {
      const user = await auth();
      if (!user.userId) {
        throw new UploadThingError("Unauthorized");
      }
      const folder = await QUERIES.getFolderById(input.folderId);
      if (!folder) {
        throw new UploadThingError("Folder not found");
      }
      if (folder.ownerId !== user.userId) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.userId, folderId: folder.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      const fileInsert = await MUTATIONS.createFile({
        file: {
          name: file.name,
          size: file.size,
          url: file.ufsUrl,
          type: file.type,
          parent: metadata.folderId,
        },
        userId: metadata.userId,
        utKey: file.key,
      });
      console.log(fileInsert);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
