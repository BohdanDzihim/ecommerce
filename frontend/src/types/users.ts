export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isSeller: boolean;
}

export interface CustomerProfile {
  id: number;
  user: UserProfile;
  imageUrl?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export type SellerType = 'private' | 'business'

export interface SellerProfile {
  id: number;
  user: UserProfile;
  sellerType: SellerType;
  shopName?: string;
  address?: string;
  phone?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  createdAt: string;
  verified: boolean;
  description?: string;
  logoUrl?: string;
}