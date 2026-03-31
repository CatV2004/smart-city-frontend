"use client";

import { createContext, useContext } from "react";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { UserDetailResponse } from "@/features/user/types";

interface UserContextType {
  user?: UserDetailResponse;
  isUserLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: undefined,
  isUserLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading: isUserLoading } = useCurrentUser();
  console.log("data user: ", data)

  return (
    <UserContext.Provider
      value={{
        user: data,
        isUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);