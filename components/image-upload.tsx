"use client";

import { CldUploadButton } from "next-cloudinary";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center" >
        <CldUploadButton
        options={{
            maxFiles:1
        }}
        uploadPreset=""
        >

        </CldUploadButton>
    </div>
  )
}
