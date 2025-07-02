'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import { FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('cart/');
        setCartItems(response.data.items);
        setTotalPrice(response.data.total_price);
        console.log(response.data);
      } catch (err) {
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleIncrease = async(id: number) => {
    try {
      const response = await api.patch('cart/increase/', {'product_id': id});
      setTotalPrice(response.data.total_price);
      setCartItems(response.data.items);
    } catch(err) {
      console.error(err);
    }
  };
  
  const handleDecrease = async(id: number) => {
    try {
      const response = await api.patch('cart/decrease/', {'product_id': id});
      setTotalPrice(response.data.total_price);
      setCartItems(response.data.items);
    } catch(err) {
      console.error(err);
    }
  };

  const updateQuantity = async(id: number, quantity: number) => {
    if (quantity < 1) {
      setError('Quantity must be more than 1')
      return;
    }

    if (quantity > 99) {
      setError('Quantity must be less than 99. You can increase quantity over 99 with a button.')
      return;
    }

    setError(null);

    try {
      const response = await api.patch('cart/update/', {'product_id': id, 'quantity': quantity});
      setTotalPrice(response.data.total_price);
      setCartItems(response.data.items);
      console.log(response.data);
    } catch(err) {
      console.error(err);
    }
  }

  const handleRemove = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to remove a product from cart? This action cannot be undone.');
    if (!confirm) return;

    try {
      const response = await api.delete('cart/remove/', {data: {
        'product_id': id
      }});
      setTotalPrice(response.data.total_price);
      setCartItems(response.data.items);
      setError(null);
      console.log(response.data);
      
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleClear = async() => {
    const confirm = window.confirm('Are you sure you want to clear your cart? This action cannot be undone.');
    if (!confirm) return;

    try {
      const response = await api.delete('cart/clear/');
      setCartItems(response.data.items);
      setTotalPrice(response.data.total_price);
      setError(null);
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading cart...</div>;

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 text-black">
      <h1 className="text-5xl font-bold mb-12">Cart</h1>

      {error && (
        <div className='text-red-600 text-sm mt-1'>{error}</div>
      )}

      {cartItems.length > 0 ? (<>
        <table className="w-full border-b">
        <thead>
          <tr className="text-left text-2xl border-b">
            <th className="py-4">Product</th>
            <th className="py-4">Price</th>
            <th className="py-4">Quantity</th>
            <th className="py-4">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} className="border-b text-xl">
              <td className="py-4 flex items-center gap-4">
                <img
                  src={item.product.imageUrl || 'https://s3-bucket-for-ecommerce-app.s3.eu-central-1.amazonaws.com/placeholders/placeholder.png'}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded"
                />
                {item.product.name}
              </td>
              <td className="py-4">${item.product.price}</td>
              <td className="py-4">
                <div className="flex items-center border rounded overflow-hidden w-fit">
                  <button
                    onClick={() => handleDecrease(item.product.id)}
                    className="px-3 py-1 hover:bg-gray-200 border-r cursor-pointer"
                  >
                    –
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    min={1}
                    max={99}
                    onChange={(e) => 
                      updateQuantity(item.product.id, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => handleIncrease(item.product.id)}
                    className="px-3 py-1 hover:bg-gray-200 border-l cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4 font-medium min-w-[50px]">
                ${item.product.price * item.quantity}
              </td>
              <td className="py-4">
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="text-black hover:text-red-600 cursor-pointer"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
          
        <tr>
          <td className="py-4 text-2xl font-semibold">Subtotal</td>
          <td></td>
          <td></td>
          <td className="py-4 text-2xl font-semibold">${totalPrice}</td>
          <td></td>
        </tr>
        </tbody>
      </table>
      
      <div className="mt-6 flex justify-end gap-6">
        <button 
          onClick={handleClear}
          className='bg-white rounded-xl border border-red-500 text-red-500 text-2xl px-8 py-3 hover:bg-red-500 hover:text-white cursor-pointer duration-300'
        >
          Clear
        </button>
        <button className="bg-black border text-white px-8 py-3 rounded-xl text-2xl hover:bg-white hover:text-black duration-300 cursor-pointer">
          Checkout
        </button>
      </div>
      </>) : (<>
        <div className='text-2xl'>There is no products in Cart yet.</div>
        <button 
          onClick={() => router.push('/products')}
          className="mt-6 bg-black text-white px-8 py-2 rounded-lg text-2xl border hover:bg-white hover:text-black cursor-pointer"
        >
          Shop Now
        </button>
      </>)}
    </div>
  );
};

export default Cart;
