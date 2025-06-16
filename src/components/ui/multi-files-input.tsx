"use client"

import { cn } from "@/lib/utils"
import { FileIcon, Trash2, Upload } from "lucide-react"
import * as React from "react"
import { Button } from "./button"

interface MultiFileInputProps {
  className?: string
  value?: File[] | null
  onChange?: (files: File[]) => void
  disabled?: boolean
  accept?: string
  maxFiles?: number
}

const MultiFileInput = ({
  className,
  value = [],
  onChange,
  disabled,
  accept = "image/*",
  maxFiles = 2,
}: MultiFileInputProps) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelection = (newFiles: FileList | null) => {
    if (!newFiles) return
    const filesArray = Array.from(newFiles)
    const merged = [...(value ?? []), ...filesArray].slice(0, maxFiles)
    onChange?.(merged)
  }

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isOver: boolean,
  ) => {
    e.preventDefault()
    if (!disabled) setIsDragging(isOver)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFileSelection(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemove = (index: number) => {
    const updated = [...(value ?? [])]
    updated.splice(index, 1)
    onChange?.(updated)
  }

  const canAddMore = (value ?? []).length < maxFiles

  return (
    <div className={cn("space-y-2", className)}>
      {canAddMore && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-md border border-dashed border-muted-foreground/25 px-6 py-8 text-center transition-colors hover:bg-muted/50",
            isDragging && "border-muted-foreground/50 bg-muted/50",
            disabled && "cursor-not-allowed opacity-60",
          )}
          role="button"
          tabIndex={0}
          aria-disabled={disabled}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            disabled={disabled}
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span>{" "}
              or drag and drop ({(value?.length ?? 0)}/{maxFiles})
            </p>
          </div>
        </div>
      )}

      {(value?.length ?? 0) > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(value ?? []).map((file, index) => (
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
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => handleRemove(index)}
                className="flex-none size-8"
              >
                <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { MultiFileInput }
