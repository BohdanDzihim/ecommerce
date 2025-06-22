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
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login/', form);
      login({username: form.username, password: form.password});
      router.push('/');
      console.log(response.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className='text-5xl font-semibold'>Login</div>
      <form onSubmit={handleLogin}>
        <div className='flex items-center gap-2 mb-4'>
          <label htmlFor="username" className='text-2xl font-semibold'>Username: </label>
          <input 
            className='border px-2 py-1 rounded text-xl'
            type="text" 
            name='username'
            value={form.username}
            onChange={handleChange}
            placeholder='Username'
          />
        </div>
        <div className='flex items-center gap-2 mb-4'>
          <label htmlFor="password" className='text-2xl font-semibold'>Password: </label>
          <input 
            className='border px-2 py-1 rounded text-xl'
            type="password" 
            name='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Password'
          />
        </div>
        <button type='submit' className='border rounded-full text-4xl px-4 py-2 bg-black text-white hover:bg-white hover:text-black cursor-pointer duration-300'>Login</button>
      </form>
    </div>
  );
};

export default Login;