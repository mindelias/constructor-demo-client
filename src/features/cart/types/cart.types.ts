export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
