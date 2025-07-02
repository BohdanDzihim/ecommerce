'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import { Product } from '@/types/products';
import Link from 'next/link';

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('products/');
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between hover:scale-105"
          >
            <img
              src={product.imageUrl || 'https://s3-bucket-for-ecommerce-app.s3.eu-central-1.amazonaws.com/placeholders/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>
            <p className="text-green-600 text-lg font-bold">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;