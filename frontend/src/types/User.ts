export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  role: 'customer' | 'admin';
  createdAt: string;
}
