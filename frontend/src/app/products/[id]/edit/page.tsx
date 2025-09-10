'use client';
import { Product } from '@/types/products';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/hooks/api';
import { UserProfile } from '@/types/users';
import camelcaseKeys from 'camelcase-keys';
import { useImageUpload } from '@/hooks/products/useImageUpload';

const EditProduct = () => {
  const params = useParams;
  const productId = params().id;

  const [formData, setFormData] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [pendingSave, setPendingSave] = useState(false);
  const {
    inputRef, 
    openFileDialog,
    handleImageUpload, 
    handleImageDelete 
  } = useImageUpload();
  const router = useRouter();

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

  useEffect(() => {
    const fetchProduct = async() => {
      try {
        const response = await api.get(`products/${productId}/`);
        const formatted = camelcaseKeys(response.data, { deep: true });
        setFormData(formatted);
        console.log(formatted);
      } catch(err) {
        console.error('Failed to fetch product data', err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value } as Product)
  };

  const handleImageSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData?.imageUrl){
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
      if (!payload.name || !payload.price || !payload.category) {
        setError('Please fill in all required fields.');
        return;
      }
      if (payload.price <= 0) {
        setError('Price must be a positive number.');
        return;
      }
      if (payload.price >= 1000000) {
        setError('Price exceeds the maximum allowed value. Value must be <1,000,000).');
        return;
      }
      const response = await api.patch(`products/update/${productId}/`, payload);
      console.log('Product updated:', response.data);
      router.push('/products/my/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='px-8 py-12 max-w-7xl mx-auto'>
        <div className='flex gap-8 items-center'>
          <div className='text-4xl font-bold mb-6'>Edit a product</div>
          {error && <div className='px-2 py-1 bg-gray-100 opacity-80 mb-4 text-red-600 text-xl rounded'>{error}</div>}
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          <div className="flex flex-col mb-4 max-w-4xl gap-2">
            <label className="block text-2xl">Name<span className='text-xl text-red-700'>*</span></label>
            <input 
              type="text" 
              name='name'
              value={formData?.name || ''}
              onChange={handleChange}
              className='border rounded p-1 w-96'
            />
          </div>
          <div className="flex flex-col max-w-4xl gap-2">
            <label className="block text-2xl">Price<span className='text-xl text-red-700'>*</span></label>
            <input 
              type="number" 
              name='price'
              value={formData?.price || ''}
              onChange={handleChange}
              className='border rounded p-1 w-96'
            />
          </div>
          <div className="flex flex-col max-w-4xl gap-2">
            <label className="block text-2xl">Description</label>
            <textarea 
              name='description'
              value={formData?.description || ''}
              onChange={handleChange}
              className='border rounded p-1 w-full h-32'
            />
          </div>
          <div className="flex flex-col max-w-4xl gap-2">
            <label className="block text-2xl">Image</label>
            <div className='flex items-center gap-4'>
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
              <div className='text-xl mt-2'>
                {formData?.imageUrl && (<div className='flex flex-row gap-2'>
                  <p>Current Image: </p>
                  <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{formData.imageUrl.split('/').pop()}</a>
                </div>)}
              </div>
            </div>
            <button
              type='button'
              onClick={() => {
                handleImageDelete(formData?.imageUrl || '');
                setFormData({ ...formData, imageUrl: '' } as Product);
              }}
              className="mt-2 text-sm text-red-500 underline cursor-pointer hover:text-red-700 text-left"
            >
              Remove Image
            </button>
          </div>
          <div className="flex flex-col max-w-4xl gap-2">
            <label className="block text-2xl">Category<span className='text-xl text-red-700'>*</span></label>
            <select 
              name="category"
              value={formData?.category || ''}
              onChange={handleChange}
              className='border rounded p-1 w-96'
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <button type='submit' className='bg-black text-white px-4 py-2 mt-6 text-2xl rounded-xl border hover:bg-white hover:text-black duration-300 cursor-pointer'>Save</button>
        </form>
      </div>
  )
}

export default EditProduct