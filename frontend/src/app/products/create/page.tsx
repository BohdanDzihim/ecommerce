'use client';
import React, { useEffect, useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: formData?.id,
        user: formData?.user as UserProfile,
        name: formData?.name,
        price: formData?.price,
        description: formData?.description,
        imageUrl: formData?.imageUrl,
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
          <input 
            type="text" 
            name='image_url'
            value={formData?.imageUrl || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
          />
        </div>
        <div className="flex flex-col max-w-4xl gap-2">
          <label className="block text-2xl">Category</label>
          <input 
            type="text" 
            name='category'
            value={formData?.category || ''}
            onChange={handleChange}
            className='border rounded p-1 w-96'
            required
          />
        </div>
        <button type='submit' className='bg-black text-white px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Add</button>
      </form>
    </div>
  )
}

export default CreateProduct