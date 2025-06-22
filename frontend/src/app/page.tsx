'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import { Product } from '@/types/products';
import ProductLine from '@/components/ProductLine';

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async() => {
      try {
        const response = await api.get('products/');
        setProducts(response.data);
        console.log(response.data);
      } catch(err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);



  return (
    <div className="px-8 py-12 text-black">
      <section className="text-center mb-16">
        <h1 className="text-6xl font-bold">Buy &amp; sell items</h1>
        <p className="text-2xl mt-4">Browse a wide selection of products</p>
        <button className="mt-6 bg-black text-white px-8 py-2 rounded-lg text-2xl border hover:bg-white hover:text-black cursor-pointer">
          Shop Now
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16 cursor-pointer">{products.map((product) => <ProductLine key={product.id} product={product} />)}</section>

      <section className='text-center'>
        <h2 className="text-3xl font-bold">Turn your items into cash</h2>
        <button className="mt-4 bg-white text-black px-8 py-2 rounded-lg text-2xl border hover:bg-black hover:text-white cursor-pointer">
          Start selling
        </button>
      </section>
    </div>
  )
}

export default Page