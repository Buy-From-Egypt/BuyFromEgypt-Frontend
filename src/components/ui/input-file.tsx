"use client";

import { cn } from "@/lib/utils";
import { FileIcon, Trash2, Upload } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { toast } from "sonner";

interface FileInputProps {
  className?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  maxFiles?: number;
}

const FileInput = ({
  className,
  value = [],
  onChange,
  disabled,
  accept,
  maxFiles = 5,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelection = (files: FileList | null) => {
    if (!disabled && files) {
      const fileArray = Array.from(files);
      if (maxFiles && fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }
      onChange?.(fileArray);
    }
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isOver: boolean
  ) => {
    e.preventDefault();
    if (!disabled) setIsDragging(isOver);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      const files = e.dataTransfer.files;
      handleFileSelection(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
  };

  const createRemoveHandler = (index: number) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange?.(newFiles);
    };
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const buttons = parent.querySelectorAll("button");
    if (!buttons) return;
    const index = Array.from(buttons).indexOf(e.currentTarget);
    if (index !== -1) {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange?.(newFiles);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-md border border-dashed border-muted-foreground/25 px-6 py-8 text-center transition-colors hover:bg-muted/50  flex items-center justify-center",
          isDragging && "border-muted-foreground/50 bg-muted/50",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-1">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span>{" "}
            or drag and drop
          </p>
          {/* {value && value.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {value.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md bg-muted/50 p-2"
                >
                  <div className="rounded-md bg-background p-2">
                    <FileIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={createRemoveHandler(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
      {value && value.length > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
          <div className="rounded-md bg-background p-2">
            <img
              src={URL.createObjectURL(value[0])}
              alt={value[0].name || "Uploaded file"}
              className="size-10 object-cover"
              onLoad={(e) => {
                // Clean up the object URL when the component unmounts
                const target = e.target as HTMLImageElement;
                URL.revokeObjectURL(target.src);
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{value[0].name}</p>
            <p className="text-xs text-muted-foreground">
              {(value[0].size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={handleRemove}
            className="flex-none size-8"
          >
            <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export { FileInput };
