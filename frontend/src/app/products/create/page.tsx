'use client';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/hooks/api';
import { Product } from '@/types/products';
import { UserProfile } from '@/types/users';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

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
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleImageRemove = async() => {
    if (formData.imageUrl) {
      try {
        await api.post('uploads/delete/', { file_url: formData.imageUrl });
      } catch(err) {
        console.error('Failed to delete image from S3', err);
      }
    }
    
    setFormData({ ...formData, imageUrl: '' });
    setPreviewUrl('');
    setSelectedImageName('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  const handleImageUpload = async(file: File) => {
    try { 
      const extension = file.name.split('.').pop();
      const contentType = file.type;

      if (formData.imageUrl) {
        try {
          await api.post('uploads/delete/', { file_url: formData.imageUrl });
          setFormData({ ...formData, imageUrl: '' });
        } catch(err) {
          console.error('Failed to delete previous image from S3', err);
        }
      }

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
    if (file) {
      handleImageUpload(file);
      setSelectedImageName(String(file.name));
      setPreviewUrl(URL.createObjectURL(file));
    }
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
      const response = await api.post('products/create/', payload);
      console.log('Product created:', response.data);
      router.push('/products/my/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='px-8 py-12 max-w-7xl mx-auto'>
      <div className='flex gap-8 items-center'>
        <div className='text-4xl font-bold mb-6'>Create a product</div>{error && <div className='px-2 py-1 bg-gray-100 opacity-80 mb-4 text-red-600 text-xl rounded'>{error}</div>}
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
              {selectedImageName && previewUrl && 
                (<p>Selected: <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedImageName}</a></p>)
              }
            </div>
          </div>
          <button
            type='button'
            onClick={() => handleImageRemove()}
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
        <button type='submit' className='bg-black text-white px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Add</button>
      </form>
      <Link href={'/products/my/'} className='flex items-center gap-1 mt-4 hover:underline hover:text-blue-600'><FaArrowLeft /> Back to your Products</Link>
    </div>
  )
}

export default CreateProduct