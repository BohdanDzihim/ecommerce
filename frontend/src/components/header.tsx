'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../context/authContext';
import { FaCartShopping } from 'react-icons/fa6';
import { api } from '@/hooks/api';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: number; name: string; imageUrl: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async() => {
      try {
        const response = await api.get(`products/?search=${query}`);
        setResults(response.data);
      } catch(err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (isAuthenticated) setOpen(false);
  }, [isAuthenticated]);
  
  return (
    <div className='flex justify-between items-center px-16 py-4'>
      <div className='text-3xl font-medium'><Link href="/">Marketplace</Link></div>

      <div className='gap-8 flex text-2xl font-semibold'>
        <Link href="/products">Shop</Link>
        <div>About</div> 
        <div>Sell</div>
      </div>
      <div className='flex items-center gap-6 h-[50px]'>
        <div className="relative w-[200px] flex items-center justify-end overflow-visible">
          <form
            className={
              `relative transition-all duration-1000
              w-[50px] h-[50px] bg-white box-border 
              border-[4px] border-white rounded p-[5px]
              hover:w-[200px] focus-within:w-[200px] valid:w-[200px] group`
            }
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              required
              className={
                `absolute top-0 left-0 w-0 h-[42.5px] text-[1em] rounded-full
                outline-none border-none px-5 transition-all duration-1000
                group-hover:w-full group-focus-within:w-full group-[.valid]:w-full`
              }
            />
            <FaSearch
              onMouseEnter={focusInput}
              className={
                `absolute top-0 right-0 w-[42.5px] h-[42.5px] p-[10px] text-[1.2em]
                text-[#07051a] rounded transition-all duration-1000
                group-hover:bg-[#07051a] group-hover:text-white
                group-focus-within:bg-[#07051a] group-focus-within:text-white`
              }
            />
            
            {showDropdown && results.length > 0 && (
              <ul className="absolute z-50 bg-white border w-full mt-12 rounded shadow text-black max-h-60 overflow-auto">
                {results.map((product) => (
                  <li key={product.id} className="hover:bg-gray-100">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center px-4 py-2 gap-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <img
                        src={product.imageUrl || "/images/placeholder.jpg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
        <Link href='/cart/' className='cursor-pointer'>
          <div className='flex items-center justify-center w-[42.5px] h-[42.5px]'>
            <FaCartShopping className='text-2xl' />
          </div>
        </Link>
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} id='dropdown' className='inline-block relative z-20'>
          <button className='cursor-pointer '>
            <div className='flex items-center justify-center w-[42.5px] h-[42.5px]'>
              <FaUser className='text-2xl' />
            </div>
          </button>
          {open && (
            <div className={`${open ? "block" : "hidden"} absolute left-1/2 bg-white -translate-x-1/2 shadow-md rounded text-2xl`}>
              {isAuthenticated ? <>
                <Link className='block text-gray-800 hover:bg-gray-200 px-4 py-2' href='/profile'>Profile</Link>
                <button onClick={logout} className='block text-gray-800 hover:bg-gray-200 px-4 py-2 cursor-pointer' type='button'>Logout</button>
              </> : <>
                <Link className='block text-gray-800 hover:bg-gray-200 px-4 py-2' href='/users/login'>Login</Link>
                <Link className='block text-gray-800 hover:bg-gray-200 px-4 py-2' href='/users/register'>Register</Link>
              </>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;