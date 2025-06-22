'use client';
import React from 'react';
import { Product } from '@/types/products';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { api } from '@/hooks/api';

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  const router = useRouter();

  const handleAddToCart = async(id: number) => {
    try {
      const response = await api.post('cart/add/', {'product_id': id});
      console.log(response.data);
      router.push('/cart');
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md text-black">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.imageUrl || '/images/placeholder.png'}
            alt={product.name}
            className="rounded-lg max-h-[400px] object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            {product.category && (
              <p className="text-gray-600 text-lg mb-2">Category: {product.category}</p>
            )}
            <p className="text-3xl font-semibold text-green-700 mb-6">${product.price}</p>
            <p className="text-lg leading-7">{product.description}</p>
          </div>

          <button onClick={() => handleAddToCart(product.id)} className="mt-6 bg-black text-white py-3 rounded-lg text-xl hover:bg-white hover:text-black border border-black transition duration-300 cursor-pointer">
            Add to Cart
          </button>
        </div>
        
      </div>
      <Link href={'/products'} className='flex items-center gap-1 mt-4 hover:underline hover:text-blue-600'><FaArrowLeft /> Back to the Products</Link>
    </div>
    
  );
};

export default ProductDetails;