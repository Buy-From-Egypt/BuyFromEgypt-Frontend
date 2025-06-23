"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type User = {
  userId: string;
  email: string;
  name: string;
  role: string;
  profileImage: string | null; 
  type: string;
  active: boolean;
  emailVerified: boolean;   
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const userId = localStorage.getItem("userId");
        
        if (token && userData && userId) {
          try {
            const parsedUser = JSON.parse(userData);
            // Ensure the user object has all required fields
            if (parsedUser && parsedUser.userId && parsedUser.email) {
              setUser(parsedUser);
            } else {
              // Clear invalid user data
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
            }
          } catch (e) {
            console.error("Failed to parse user data:", e);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData.userId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
