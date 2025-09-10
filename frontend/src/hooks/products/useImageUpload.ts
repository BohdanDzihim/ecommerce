import { useRef } from "react";
import { api } from "@/hooks/api";

export const useImageUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => inputRef.current?.click();

  const handleImageUpload = async(file: File) => {
    try { 
      const extension = file.name.split('.').pop();
      const contentType = file.type;

      const res = await api.post('uploads/presign/', { extension, content_type: contentType, folder: 'product-images' });

      const { upload_url, file_url } = res.data;

      await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });

      return file_url;
    } catch(err) {
      console.error('Upload failed', err);
      return null;
    };
  };

  const handleImageDelete = async(file_url: string) => {
    try {    
      await api.post('uploads/delete/', { file_url });
    } catch(err) {
      console.error('Failed to delete image from S3', err);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }
  return {
    inputRef,
    openFileDialog,
    handleImageUpload,
    handleImageDelete,
  };

}