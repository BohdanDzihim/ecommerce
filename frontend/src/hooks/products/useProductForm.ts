import { useState, useEffect } from "react";
import { api } from "@/hooks/api";
import { UserProfile } from "@/types/users";
import { Product } from "@/types/products";
import { useRouter } from "next/navigation";

type Props = {
  mode: 'create' | 'edit';
  initialData?: Product | null;
}

export const useProductForm = ({ mode, initialData }: Props) => {
  const isEdit = mode === 'edit';
  const [formData, setFormData] = useState<Product>({
    id: 0,
    user: {} as UserProfile,
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: '',
  });
  const url = isEdit ? `products/update/${formData.id}/` : 'products/create/';
  const method = isEdit ? 'PATCH' : 'POST';
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(initialData);
    }
  }, [isEdit, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value } as Product)
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.price || !formData.category) {
        setError('Please fill in all required fields.');
        return;
      }
      if (formData.price <= 0) {
        setError('Price must be a positive number.');
        return;
      }
      if (formData.price >= 1000000) {
        setError('Price exceeds the maximum allowed value. Value must be <1,000,000).');
        return;
      }
      const response = await api.request({ url,
        method,
        data: {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          image_url: formData.imageUrl,
          category: formData.category,
        },
      });
      console.log(response);
      router.push('/products/my/');
    } catch (err) {
      console.error(err);
    }
  }

  return {
    formData,
    setFormData,
    error,
    handleChange,
    handleSubmit,
  };
}