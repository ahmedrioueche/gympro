import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "../utils/helper";
import type { UserProfile } from "../types/user";

export interface AppContextProps {
  currentUser: UserProfile;
  setCurrentUser: Dispatch<SetStateAction<UserProfile>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("App context must be used within a AppContextProvider");
  }
  return context;
};

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with values from localStorage or empty objects
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    getLocalStorageItem("currentUser", {} as UserProfile)
  );

  // Persist to localStorage whenever state changes
  useEffect(() => {
    setLocalStorageItem("currentUser", currentUser);
  }, [currentUser]);

  const value: AppContextProps = {
    currentUser,
    setCurrentUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
