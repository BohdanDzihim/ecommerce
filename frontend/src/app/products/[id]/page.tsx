'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import ProductDetails from '@/components/ProductDetails';
import { useParams } from 'next/navigation';
import { Product } from '@/types/products';

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-10 text-xl">Loading...</div>;

  return <ProductDetails product={product} />;
};

export default ProductPage;