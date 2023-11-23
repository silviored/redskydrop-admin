import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { PropsWithChildren } from 'react';

import { USER_SESSION_STORAGE_KEY } from '@/constants/keys';
import { ROUTES } from '@/constants/routes';
import { ApiService } from '@/services/api';
import { CacheService } from '@/services/cache';
import TokenValidityService from '@/services/token-validity';

import * as Types from './types';

const GlobalContext = createContext<Types.GlobalState>({} as Types.GlobalState);

export const GlobalStateProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<UserResponseApi>();
  const logged = !!user;

  const saveUser = useCallback((currentUser: UserResponseApi) => {
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    CacheService.user.clear();
    // window.location.href = ROUTES.HOME;
  }, []);

  TokenValidityService.logout = logout;

  useEffect(() => {
    const cachedUser = localStorage.getItem(USER_SESSION_STORAGE_KEY);
    if (cachedUser) {
      const currentUser = JSON.parse(cachedUser);
      setUser(currentUser);
      ApiService.persistToken(currentUser.token);
      return;
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        saveUser,
        logged,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      'useGlobalState should be encapsuled inside GlobalContextProvider'
    );
  }

  return useContext(GlobalContext);
};
