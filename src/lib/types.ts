export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface PaymentMethod {
    type: 'pix' | 'credit_card' | 'boleto';
    label: string;
    icon: string;
    description: string;
  }
  
  export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    paymentMethod: PaymentMethod['type'];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
  }