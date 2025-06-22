import React from 'react';
import { Product } from '@/types/products';
import { api } from '@/hooks/api';
import { useRouter } from 'next/navigation';

interface ProductLineProps {
  product: Product;
}

const ProductLine = ({product}: ProductLineProps) => {
  const router = useRouter();

  const handleClick = async(id: number) => {
    try {
      const response = await api.get(`products/${id}`);
      console.log(response.data);
      router.push(`products/${response.data.id}`);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div onClick={() => handleClick(product.id)} className="flex justify-between items-center border rounded-xl p-6 hover:scale-105 duration-300">
      <img 
        src={product.imageUrl || 'images/placeholder.png'} 
        alt={product.name} 
        className="w-16 h-16 object-contain rounded" 
      />
      <div className="text-right">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-lg font-medium">€{product.price}</p>
      </div>
    </div>
  )
}

export default ProductLine