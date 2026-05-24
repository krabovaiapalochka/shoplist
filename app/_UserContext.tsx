import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { authApi, UserResponse, UserUpdate } from "./_auth";
import { getStoredToken, saveToken, clearToken } from "./_api";

interface UserContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdate) => Promise<void>;
  uploadAvatar: (uri: string) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          const me = await authApi.getMe();
          setUser(me);
        }
      } catch {
        await clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    await saveToken(res.access_token);
    setToken(res.access_token);
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string) => {
    await authApi.register(email, username, password);
    await login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    await clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: UserUpdate) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
  }, []);

  const uploadAvatar = useCallback(async (uri: string) => {
    await authApi.uploadAvatar(uri);
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const deleteAvatar = useCallback(async () => {
    await authApi.deleteAvatar();
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
