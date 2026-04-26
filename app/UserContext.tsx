import React, { createContext, useContext, useState } from "react";

interface User {
  username: string;
  phone: string;
  email: string;
  birthday: string;
  avatarUri?: string;
}

interface UserContextType {
  user: User;
  setUsername: (name: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setBirthday: (birthday: string) => void;
  setAvatarUri: (uri: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    username: "IGGY",
    phone: "",
    email: "",
    birthday: "",
    avatarUri: undefined,
  });

  const setUsername = (name: string) => setUser({ ...user, username: name });
  const setPhone = (phone: string) => setUser({ ...user, phone });
  const setEmail = (email: string) => setUser({ ...user, email });
  const setBirthday = (birthday: string) => setUser({ ...user, birthday });
  const setAvatarUri = (uri: string) => setUser({ ...user, avatarUri: uri });

  return (
    <UserContext.Provider
      value={{
        user,
        setUsername,
        setPhone,
        setEmail,
        setBirthday,
        setAvatarUri,
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