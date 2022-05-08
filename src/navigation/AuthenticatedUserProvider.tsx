import React, { useState, createContext } from 'react';
import { User } from 'firebase/auth';

interface AuthContextData {
    user: User;
    setUser(user?: User | null): void;
  }

export const AuthenticatedUserContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthenticatedUserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
