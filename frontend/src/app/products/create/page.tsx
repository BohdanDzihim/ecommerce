'use client';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/hooks/api';
import { Product } from '@/types/products';
import { UserProfile } from '@/types/users';

const CreateProduct = () => {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    user: {} as UserProfile,
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSave, setPendingSave] = useState(false);

  const categories = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' }, 
    { value: 'Home', label: 'Home' },
    { value: 'Beauty', label: 'Beauty' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Toys', label: 'Toys' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Health', label: 'Health' },
    { value: 'Grocery', label: 'Grocery' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleImageUpload = async(file: File) => {
    try {
      const extension = file.name.split('.').pop();
      const contentType = file.type;

      const res = await api.post('uploads/presign/', { extension, content_type: contentType, folder: 'product-images' });

      const { upload_url, file_url } = res.data;

      console.log(file_url);

      await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });

      setFormData({ ...formData, imageUrl: file_url });
      setPendingSave(true);

    } catch(err) {
      console.error('Upload failed', err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  }

  useEffect(() => {
    if (pendingSave) {
      setPendingSave(false);
    }
    console.log(formData);
  }, [pendingSave]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: formData?.id,
        user: formData?.user as UserProfile,
        name: formData?.name,
        price: formData?.price,
        description: formData?.description,
        image_url: formData?.imageUrl,
        category: formData?.category,
      };
      const response = await api.post('products/create/', payload);
      console.log('Product created:', response.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='px-8 py-12 max-w-7xl mx-auto'>
      <div className='text-4xl font-bold mb-6'>Create a product</div>
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="flex flex-col mb-4 max-w-4xl gap-2">
          <label className="block text-2xl">Name</label>
          <input 
            type="text" 
            name='name'
            value={formData?.name || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
            required
          />
        </div>
        <div className="flex flex-col max-w-4xl gap-2">
          <label className="block text-2xl">Price</label>
          <input 
            type="number" 
            name='price'
            value={formData?.price || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
            required
          />
        </div>
        <div className="flex flex-col max-w-4xl gap-2">
          <label className="block text-2xl">Description</label>
          <input 
            type="text" 
            name='description'
            value={formData?.description || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
          />
        </div>
        <div className="flex flex-col max-w-4xl gap-2">
          <label className="block text-2xl">Image</label>
          <div
            onClick={openFileDialog}
            className='px-2 py-1 mt-2 text-xl rounded-xl border hover:cursor-pointer hover:bg-gray-200 duration-300 w-24 text-center'
          >
            Upload
          </div>
          <input 
            ref={inputRef}
            name='imageUrl'
            type="file" 
            accept='image/*'
            onChange={handleImageSelect}
            className='hidden'
          />
        </div>
        <div className="flex flex-col max-w-4xl gap-2">
          <label className="block text-2xl">Category</label>
          <select 
            name="category"
            value={formData?.category || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <button type='submit' className='bg-black text-white px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Add</button>
      </form>
    </div>
  )
}

export default CreateProduct