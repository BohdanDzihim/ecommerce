import { UserProfile } from "./users";

export interface Product {
  id: number;
  user: UserProfile;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category: string;
}