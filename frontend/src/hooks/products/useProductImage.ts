import { useEffect, useState } from 'react';
import { useImageUpload } from './useImageUpload';
import { Product } from '@/types/products';

export const useProductImage = ({
  formData,
  setFormData,
}: {
  formData: Product;
  setFormData: React.Dispatch<React.SetStateAction<Product>>;
}) => {
  const [pendingSave, setPendingSave] = useState(false);

  const {
    inputRef,
    openFileDialog,
    handleImageUpload,
    handleImageDelete,
  } = useImageUpload();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData?.imageUrl) {
      const file_url = await handleImageDelete(formData.imageUrl);
      setFormData({ ...formData, imageUrl: file_url } as Product);
    }

    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setFormData({ ...formData, imageUrl: uploadedUrl } as Product);
      setPendingSave(true);
    }
  };

  useEffect(() => {
    if (pendingSave) {
      setPendingSave(false);
    }
  }, [pendingSave]);

  return {
    inputRef,
    openFileDialog,
    handleImageSelect,
    handleImageDelete,
  };
};
