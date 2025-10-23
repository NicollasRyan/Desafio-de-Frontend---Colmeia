import { mockUsers } from "./mockData";
import { User } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const AUTH_KEY = "mock_auth_user";
const USERS_KEY = "mock_users";

export const initializeMockUsers = () => {
  if (typeof window === "undefined") return;
  
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

export const getAllUsers = (): User[] => {
  if (typeof window === "undefined") return mockUsers;
  
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : mockUsers;
};

export const mockRegister = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  await delay(1000);

  const users = getAllUsers();
  
  if (users.find(u => u.email === email)) {
    return {
      success: false,
      message: "Este email já está cadastrado",
    };
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));

  return {
    success: true,
    message: "Conta criada com sucesso!",
    user: newUser,
  };
};

export const mockLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  await delay(1000); 

  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return {
      success: false,
      message: "Email ou senha incorretos",
    };
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return {
    success: true,
    message: "Login realizado com sucesso!",
    user,
  };
};

export const mockLogout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  // Limpar carrinho ao fazer logout
  localStorage.removeItem('cart');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
};


export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};