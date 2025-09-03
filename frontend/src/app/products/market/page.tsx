'use client';
import { Product } from '@/types/products';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async() => {
      try {
        const response = await api.get('products/market/');
        setMyProducts(response.data);
        setIsSeller(true);
      } catch(err: any) {
        if (err.response?.status === 403) {
          setError("Forbidden. You are not a seller");
          setIsSeller(false);
        } else {
          setError("An unexpected error occurred. Please try again later.")
          setIsSeller(true);
        }
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className='px-8 py-12 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-10'>
        <div className='text-3xl font-bold'>My Products</div>
        {isSeller && (<Link 
          href={"create/"}
          className='bg-white px-4 py-2 mt-6 text-2xl rounded-xl border hover:bg-green-600 hover:text-white duration-300 cursor-pointer'
        >Add</Link>)}
      </div>
      {!isSeller && error && (<div>
      <p className='text-xl'>
        <span>You need to be a seller to view this page. Please contact support if you believe this is an error.</span>
        <span>Otherwise, you can start selling by applying to become a seller!
        </span>
      </p>
      <button
        onClick={() => router.push('/profile/edit/')} 
        className='bg-black text-white px-4 py-2 mt-6 text-2xl rounded-xl border hover:bg-white hover:text-black duration-300 cursor-pointer'
      >Become a seller</button>
      </div>)}
      {myProducts.length === 0 && isSeller && (<p className='text-xl'>You have no products listed. Start selling by adding a new product!</p>
      )}
      {myProducts.length > 0 && isSeller && (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">{myProducts.map((myProduct) => (
        <Link
          key={myProduct.id}
          href={`/products/${myProduct.id}`}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between hover:scale-105"
        >
          <img
              src={myProduct.imageUrl || 'https://s3-bucket-for-ecommerce-app.s3.eu-central-1.amazonaws.com/placeholders/placeholder.png'}
              alt={myProduct.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{myProduct.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{myProduct.category}</p>
            <p className="text-green-600 text-lg font-bold">${myProduct.price}</p>
        </Link>
      ))}</div>)}
    </div>
  )
}

export default MyProducts