'use client';
import React, { useState } from 'react';
import { api } from '@/hooks/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [form, setForm] = useState({
    username: '', 
    password: '',
  });

  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('auth/login/', form);
      login({username: form.username, password: form.password});
      router.push('/');
    } catch(err) {
      console.error(err);
      setError("Invalid username or password!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className='text-3xl font-bold text-center mb-6'>Login</div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className='block font-medium'>Username: </label>
            <input 
              className='w-full px-4 py-2 border rounded-xl mt-1'
              type="text" 
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder='Username'
            />
          </div>
          <div>
            <label htmlFor="password" className='block font-medium'>Password: </label>
            <input 
              className='w-full px-4 py-2 border rounded-xl mt-1'
              type="password" 
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Password'
            />
          </div>
          <button type='submit' className='w-full bg-black text-white py-2 rounded-xl font-semibold cursor-pointer hover:bg-white hover:text-black border transition duration-300'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login