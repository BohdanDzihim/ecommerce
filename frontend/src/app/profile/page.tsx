'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/hooks/api';
import { UserProfile, CustomerProfile, SellerProfile } from '@/types/users';
import camelcaseKeys from 'camelcase-keys';
import { useRouter } from 'next/navigation';
import ProfileSection from '@/components/ProfileSection';

const Profile = () => {
  const [user, setUser] = useState<UserProfile>();
  const [customer, setCustomer] = useState<CustomerProfile>();
  const [seller, setSeller] = useState<SellerProfile>();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async() => {
      try {
        const response = await api.get('auth/profile/');
        const camelData = camelcaseKeys(response.data, { deep: true })
        console.log(response.data);
        console.log(response.data.user);
        console.log(response.data.customer_profile);
        console.log(response.data.seller_profile);
        setUser(camelData.user);
        setCustomer(camelData.customerProfile);
        if (camelData.sellerProfile) {
          setSeller(camelData.sellerProfile);
        }
      } catch(err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className='mx-auto my-2 flex flex-col items-center max-w-6xl'>
      <div className='text-5xl font-semibold'>Profile</div>
      <div className='flex flex-col gap-2 my-2'>
        <div className='flex flex-col items-center mt-8 mb-6'>
          {user && (
            <div className='flex flex-col items-center justify-center'>
              <img
                src={customer?.imageUrl || 'images/placeholder.png'} 
                alt='image'
                className='w-40 h-40 rounded-full mb-4'
              />
              <div className='text-4xl font-semibold'>{user?.username}</div>
              {(user?.firstName || user?.lastName) && (
                <div className='text-2xl'>{user?.firstName} {user?.lastName}</div>
              )}
              {user?.email && (
                <div className='text-2xl font-semibold'>{user.email}</div>
              )}
            </div>
          )}
          
          <div className='flex justify-center mt-4'>
            <button 
              onClick={() => router.push('/profile/edit/')} 
              className='bg-black text-white px-4 py-2 text-2xl rounded-xl border hover:bg-white hover:text-black duration-300 cursor-pointer'
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-4 w-full flex justify-center">
          <div className={`${customer && seller ? 'grid-cols-2 gap-12' : 'grid-cols-1'} w-full max-w-5xl grid`}>
            {customer && (
              <ProfileSection
                title="Customer"
                fields={[
                  { label: 'Phone', value: customer.phone },
                  { label: 'Address', value: customer.address },
                  { label: 'Postal code', value: customer.postalCode },
                  { label: 'City', value: customer.city },
                  { label: 'Country', value: customer.country },
                ]}
              />
            )}

            {seller && (
              <ProfileSection
                title="Seller"
                fields={[
                  { label: 'Seller Type', value: seller.sellerType },
                  { label: 'Shop name', value: seller.shopName },
                  { label: 'Phone', value: seller.phone },
                  { label: 'Address', value: seller.address },
                  { label: 'Postal code', value: seller.postalCode },
                  { label: 'City', value: seller.city },
                  { label: 'Country', value: seller.country },
                  { label: 'Created at', value: seller.createdAt },
                  { label: 'Description', value: seller.description },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile