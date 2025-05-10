"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X, User } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "../ui/button";

interface ProfileImageUploadProps {
  onChange: (urls: { id: string; url: string }[]) => void;
  value: { id: string; url: string }[];
  disabled?: boolean;
}

export function ProfileImageUpload({ onChange, value, disabled }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (results) => {
      if (!results || results.length === 0) return;
      
      setIsUploading(false);
      // Replace any existing image with the new one
      const newImage = {
        id: "profile-image",
        url: results[0].url,
      };
      onChange([newImage]);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setError(error.message);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      setError(null);
      
      if (acceptedFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      // Only allow images
      const imageFiles = acceptedFiles.filter((file) => 
        file.type.startsWith("image/")
      );
      
      if (imageFiles.length === 0) {
        setError("Пожалуйста, загрузите только изображения");
        setIsUploading(false);
        return;
      }

      // Only use the first image
      await startUpload([imageFiles[0]]);
    },
    [startUpload]
  );

  const removeImage = () => {
    onChange([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    disabled: isUploading || disabled,
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      {value.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32 rounded-full overflow-hidden bg-indigo-100 border-4 border-white shadow-lg mb-4">
            <Image
              src={value[0].url}
              alt="Profile image"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              onClick={removeImage}
              disabled={disabled}
              className="absolute top-1 right-1 p-1 h-auto w-auto bg-black/50 hover:bg-black/70 rounded-full"
              size="icon"
              variant="destructive"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Удалить изображение</span>
            </Button>
          </div>
          
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
              ${isUploading || disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-500">Загрузить другое изображение</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
            ${isUploading || disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg 
                  className="animate-spin h-10 w-10 text-indigo-500 mb-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-500">Загрузка...</p>
              </div>
            ) : (
              <>
                <User className="h-10 w-10 text-indigo-500" />
                <div className="text-sm font-medium">
                  {isDragActive ? (
                    <p>Отпустите файл сюда</p>
                  ) : (
                    <p>Перетащите и отпустите или нажмите для загрузки фото профиля</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Загрузите изображение (PNG, JPG, WEBP, до 4MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
} 