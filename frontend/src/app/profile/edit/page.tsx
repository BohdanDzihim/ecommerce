'use client';
import React, { useEffect, useState } from 'react';
import { UserProfile, CustomerProfile, SellerProfile } from '@/types/users';
import { api } from '@/hooks/api';
import camelcaseKeys from 'camelcase-keys';

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'customer' | 'seller'>('general');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [wasSeller, setWasSeller] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.patch('auth/profile/edit/', {
        user: {
          username: user?.username,
          first_name: user?.firstName,
          last_name: user?.lastName,
          email: user?.email,
          is_seller: user?.isSeller,
        },
        customer_profile: {
          image_url: customer?.imageUrl,
          phone: customer?.phone,
          address: customer?.address,
          postal_code: customer?.postalCode,
          city: customer?.city,
          country: customer?.country,
        },
        seller_profile: {
          seller_type: seller?.sellerType,
          shop_name: seller?.shopName,
          phone: seller?.phone,
          address: seller?.address,
          postal_code: seller?.postalCode,
          city: seller?.city,
          country: seller?.country,
          description: seller?.description,
          logo_url: seller?.logoUrl,
        }
      });

      const updated = response.data;
      setUser(camelcaseKeys(updated.user));
      setCustomer(camelcaseKeys(updated.customerProfile));

      if (updated.user.is_seller && updated.sellerProfile) {
        setSeller(camelcaseKeys(updated.sellerProfile));
        setIsSeller(true);
      }

      console.log(`updated.user.is_seller: ${updated.user.is_seller}`);
      
      console.log(`wasSeller: ${wasSeller}`);
      if (!wasSeller && updated.user.is_seller) {
        setShowCongrats(true);
        console.log(`showCongrats: ${showCongrats}`);
        setActiveTab('seller');
      }

      console.log(`showCongrats2: ${showCongrats}`);

      console.log(updated);
    } catch(err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    section: 'user' | 'customer' | 'seller'
  ) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    if (section === 'user' && user) {
      setUser({ ...user, [name]: finalValue });
    }
    
    if (section === 'customer' && customer) {
      setCustomer({ ...customer, [name]: finalValue });
    }

    if (section === 'seller' && seller) {
      setSeller({ ...seller, [name]: finalValue });
    }
  };

  useEffect(() => {
    const fetchProfile = async() => {
      try {
        const response = await api.get('auth/profile/');
        const data = camelcaseKeys(response.data, { deep: true });

        setUser(data.user);
        setWasSeller(data.user.isSeller);
        setCustomer(data.customerProfile);
        if (data.user.isSeller && data.sellerProfile) {
          setIsSeller(true);
          setSeller(data.sellerProfile);
        }

        console.log(response.data);
      } catch(err) {
        console.error(err);
      }
    }

    fetchProfile();
  }, []);

  return (
    <>
      {showCongrats && <div className='z-10 relative mb-8 bg-green-100 px-6 py-4 mx-16 rounded shadow-sm'>
        <button 
          onClick={() => setShowCongrats(false)} 
          className="cursor-pointer absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
        <p className='text-lg'>You’ve just become a seller. Please complete your seller profile below so customers can learn more about your shop.</p>
      </div>}
      <div className='flex mx-16 mt-8 gap-12'>
        <aside className="h-full w-80 p-6 bg-gray-100 rounded shadow-sm text-2xl font-semibold text-gray-800 flex flex-col">
          <h1 className="text-5xl font-bold mb-8">Edit Profile</h1>
          <nav className='flex flex-col gap-2 text-2xl font-semibold'>
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-2 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                activeTab === 'general' ? 'bg-black text-white' : 'hover:bg-gray-200'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`py-2 px-2 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                activeTab === 'customer' ? 'bg-black text-white' : 'hover:bg-gray-200'
              }`}
            >
              Customer
            </button>
            {isSeller && seller && (
              <button
                onClick={() => setActiveTab('seller')}
                className={`py-2 px-2 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                  activeTab === 'seller' ? 'bg-black text-white' : 'hover:bg-gray-200'
                }`}
              >
                Seller
              </button>
            )}
          </nav>
        </aside>
        <div className='flex-1'>
          <main>
            {user && activeTab === 'general' && (
              <div>
                <div className='text-5xl font-bold my-6'>General Profile</div>
                <form onSubmit={(e) => handleSubmit(e)} className='space-y-6'>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Username</label>
                    <input 
                      type="text" 
                      name='username'
                      value={user?.username || ''}
                      onChange={(e) => handleChange(e, 'user')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>First Name</label>
                    <input 
                      type="text" 
                      name='firstName'
                      value={user?.firstName || ''}
                      onChange={(e) => handleChange(e, 'user')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Last Name</label>
                    <input 
                      type="text" 
                      name='lastName'
                      value={user?.lastName || ''}
                      onChange={(e) => handleChange(e, 'user')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Email</label>
                    <input 
                      type="text" 
                      name='email'
                      value={user?.email || ''}
                      onChange={(e) => handleChange(e, 'user')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  {!isSeller && (<div className='flex flex-row items-center'>
                    <label className='mr-2 block text-xl'>Is Seller</label>
                    <input 
                      type="checkbox" 
                      name='isSeller'
                      checked={user?.isSeller || false}
                      onChange={(e) => handleChange(e, 'user')}
                      className='border rounded h-4 w-4 cursor-pointer' 
                    />
                  </div>)}
                  <button type='submit' className='bg-black text-white px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Save Changes</button>
                </form>
              </div>
            )}
            {customer && activeTab === 'customer' && (
              <div>
                <div className='text-5xl font-bold my-6'>Customer Profile</div>
                <form onSubmit={(e) => handleSubmit(e)} className='space-y-6'>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Phone</label>
                    <input 
                      type="text" 
                      name='phone'
                      value={customer?.phone || ''}
                      onChange={(e) => handleChange(e, 'customer')}
                      className='border p-1 rounded w-96'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Address</label>
                    <input 
                      type="text" 
                      name='address'
                      value={customer?.address || ''}
                      onChange={(e) => handleChange(e, 'customer')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Postal Code</label>
                    <input 
                      type="text" 
                      name='postalCode'
                      value={customer?.postalCode || ''}
                      onChange={(e) => handleChange(e, 'customer')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>City</label>
                    <input 
                      type="text" 
                      name='city'
                      value={customer?.city || ''}
                      onChange={(e) => handleChange(e, 'customer')}
                      className='border p-1 rounded w-96' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='mb-1 block text-xl'>Country</label>
                    <input 
                      type="text" 
                      name='country'
                      value={customer?.country || ''}
                      onChange={(e) => handleChange(e, 'customer')}
                      className='border p-1 rounded w-96'
                    />
                  </div>
                  <button type='submit' className='bg-black text-white my-2 px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Save Changes</button>
                </form>
              </div>
            )}
            {seller && activeTab === 'seller' && (
              <div>
                <div className='text-5xl font-bold my-6'>Seller Profile</div>
                <form onSubmit={(e) => handleSubmit(e)} className='space-y-6'>
                  <div className='flex flex-row gap-16'>
                    <div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Shop Name</label>
                        <input 
                          type="text" 
                          name='shopName'
                          value={seller?.shopName || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Phone</label>
                        <input 
                          type="text" 
                          name='phone'
                          value={seller?.phone || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Description</label>
                        <input 
                          type="text" 
                          name='description'
                          value={seller?.description || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                    </div>
                    <div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Address</label>
                        <input 
                          type="text" 
                          name='address'
                          value={seller?.address || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Postal Code</label>
                        <input 
                          type="text" 
                          name='postalCode'
                          value={seller?.postalCode || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>City</label>
                        <input 
                          type="text" 
                          name='city'
                          value={seller?.city || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                      <div className='flex flex-col my-4'>
                        <label className='mb-1 block text-xl'>Country</label>
                        <input 
                          type="text" 
                          name='country'
                          value={seller?.country || ''}
                          onChange={(e) => handleChange(e, 'seller')}
                          className='border p-1 rounded w-96 text-lg' 
                        />
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='bg-black text-white px-6 py-2 rounded-xl text-2xl cursor-pointer hover:opacity-80 duration-300'>Save Changes</button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default EditProfile