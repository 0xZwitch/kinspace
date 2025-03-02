"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, UploadIcon } from "lucide-react"
import { Input } from "./ui/input"

interface ImageUploaderProps {
  onUpload: (file: File) => void,
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onUpload(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      {preview ? (
        <div className="mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto max-h-48 mx-auto" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
        </div>
      )}
      <Button type="button" variant="outline" className="mt-2">
        <UploadIcon className="mr-2 h-4 w-4" /> Upload Image
      </Button>
    </div>)
}
