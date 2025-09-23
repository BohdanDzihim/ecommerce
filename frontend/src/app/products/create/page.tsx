'use client';
import React from 'react';
import { Product } from '@/types/products';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useProductImage } from '@/hooks/products/useProductImage';
import { useProductForm } from '@/hooks/products/useProductForm';
import { categories } from '@/constants/categories';

const CreateProduct = () => {
  const { formData, setFormData, error, handleChange, handleSubmit } = useProductForm({ mode: 'create' });
  const { inputRef, openFileDialog, handleImageSelect, handleImageDelete } = useProductImage({ formData: formData, setFormData: setFormData });

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
              }
            }
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