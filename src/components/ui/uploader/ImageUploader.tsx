"use client";

import CustomLoading from "@/components/loader/CustomLoading";
import { useEffect, useState } from "react";

interface IImageUploadProps {
  type?: "circular" | "square";
  defaultImage: string;
  handleGetImage: (payload: File) => void;
  isLoading: boolean;
  size?: string;
  name?: string;
}

export default function ImageUploader({
  name = "Profile",
  type = "circular",
  defaultImage,
  isLoading = false,
  handleGetImage,
  size = "128px",
}: IImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 1. Update local preview
      setImage(URL.createObjectURL(file));

      // 2. Pass it up
      handleGetImage(file);
    }
  };

  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage);
    }

    return () => {};
  }, [defaultImage]);

  /* ******************************

  ******************************************/

  return (
    <div className={`flex flex-col justify-center items-center gap-4`}>
      {/* Square Upload Box */}
      {/* {type === "square" && (
        <label
          className={`flex flex-col items-center justify-center w-${size} h-${size} cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors`}
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <span className="text-gray-500 text-2xl">+</span>
              <span className="text-gray-500">Upload</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
      )} */}

      {/* Circular Upload Box */}
      {type === "circular" && (
        <label className="relative flex flex-col items-center justify-center w-32 h-32 cursor-pointer p-1 border-2 rounded-full group">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleImageUpload}
            aria-label="Upload logo"
          />

          <img
            src={
              image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="Image preview"
            className="w-full h-full object-cover rounded-full"
          />

          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-linear-to-tr from-primary to-secondary border-2 text-xs font-bold text-base-300 rounded-full px-2 py-0.5">
            {name}
          </span>

          {isLoading && (
            <div className="absolute inset-0 bg-base-300 bg-opacity-50 rounded-full flex items-center justify-center">
              <CustomLoading />
            </div>
          )}
        </label>
      )}
    </div>
  );
}
