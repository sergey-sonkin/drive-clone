import {
  Folder as FolderIcon,
  FileIcon,
  Trash2Icon,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { deleteFile, renameFile } from "~/server/actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function DeleteMenuItem({
  file,
  onSuccess,
}: {
  file: DB_FileType;
  onSuccess: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await deleteFile(file.id);
      setIsDeleting(false);
      onSuccess();
    } catch (error) {
      console.error("Error deleting file:", error);
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenuItem disabled={isDeleting} onClick={handleDelete}>
      {isDeleting ? (
        <>
          <span className="inline-flex h-4 w-4 animate-spin items-center justify-center rounded-full border-2 border-gray-300 border-t-blue-600"></span>
          Deleting...
        </>
      ) : (
        <>
          <Trash2Icon className="h-4 w-4" />
          Delete
        </>
      )}
    </DropdownMenuItem>
  );
}

function RenameFileItem({
  file,
  onSuccess,
}: {
  file: DB_FileType;
  onSuccess: () => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsRenaming(true);
      await renameFile(file.id, "New File Name");
      setIsRenaming(false);
      onSuccess();
    } catch (error) {
      console.error("Error renaming file:", error);
      setIsRenaming(false);
    }
  };

  return (
    <DropdownMenuItem disabled={isRenaming} onClick={handleRename}>
      {isRenaming ? (
        <>
          <span className="inline-flex h-4 w-4 animate-spin items-center justify-center rounded-full border-2 border-gray-300 border-t-blue-600"></span>
          Renaming ...
        </>
      ) : (
        <>
          <SquarePen className="h-4 w-4" />
          Rename
        </>
      )}
    </DropdownMenuItem>
  );
}

function EditFileDropDown(props: { file: DB_FileType }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DeleteMenuItem file={props.file} onSuccess={handleDeleteSuccess} />
          <RenameFileItem file={props.file} onSuccess={handleDeleteSuccess} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FileRow(props: { file: DB_FileType }) {
  const { file } = props;

  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-3 text-gray-400">
          {file.type ? file.type.split("/").pop() || file.type : ""}
        </div>
        <div className="col-span-2 text-gray-400">{file.size}</div>

        <div className="col-span-1 text-gray-400">
          <EditFileDropDown file={file} />
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: { folder: DB_FolderType }) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-3 text-gray-400"></div>
      </div>
    </li>
  );
}
