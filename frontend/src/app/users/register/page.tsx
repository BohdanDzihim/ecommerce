'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { api } from '@/hooks/api';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      setError('All fields are required.')
      return
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.')
      return
    }

    try {
      await api.post('auth/register/', formData);
      setSuccess('Registration successful!');
      login({username: formData.username, password: formData.password});
      router.push('/');
    } catch (err) {
      setError('Registration failed.');
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-medium">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="password2" className="block font-medium">Repeat Password</label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold cursor-pointer hover:bg-white hover:text-black border transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistrationPage
