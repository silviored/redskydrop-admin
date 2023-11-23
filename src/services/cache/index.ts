import {
  ACCEPTED_THE_USE_COOKIES,
  JWT_EXPIRATION_DATE,
  PUBLIC_TOKEN_SESSION_STORAGE_KEY,
  USER_COOKIES_STORAGE_KEY,
  USER_PRODUCTS_STORAGE_KEY,
  USER_REMEMBER_ME_STORAGE_KEY,
  USER_SESSION_STORAGE_KEY,
  USER_TYPE,
} from '@/constants/keys';
import { QueryClient } from '@tanstack/react-query';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { setCookie, destroyCookie } from 'nookies';

const user = {
  saveCurrentUser: (currentUser: UserResponseApi) => {
    window.localStorage.setItem(
      USER_SESSION_STORAGE_KEY,
      JSON.stringify(currentUser)
    );
    setCookie(
      undefined,
      USER_COOKIES_STORAGE_KEY,
      JSON.stringify(currentUser),
      {
        maxAge: 604800, // 7 dias em segundos
      }
    );
  },
  saveRememberMe: (value: boolean) => {
    window.localStorage.setItem(
      USER_REMEMBER_ME_STORAGE_KEY,
      JSON.stringify(value)
    );
  },
  getRememberMe: () => {
    return window.localStorage.getItem(USER_REMEMBER_ME_STORAGE_KEY);
  },
  saveCurrentPublicToken: (currentPublicToken: string) => {
    window.localStorage.setItem(
      PUBLIC_TOKEN_SESSION_STORAGE_KEY,
      currentPublicToken
    );
  },
  saveExpirationTokenDate: (timestamp: string) => {
    window.localStorage.setItem(JWT_EXPIRATION_DATE, timestamp);
  },
  getExpirationTokenDate: (): Promise<Date> => {
    return new Promise((resolve, reject) => {
      try {
        const expirationDate = window.localStorage.getItem(JWT_EXPIRATION_DATE);

        if (expirationDate) {
          resolve(new Date(Number(expirationDate)));
        }

        reject();
      } catch (getExpirationTokenDateError) {
        reject();
      }
    });
  },
  getCurrentPublicToken: () => {
    return window.localStorage.getItem(PUBLIC_TOKEN_SESSION_STORAGE_KEY);
  },
  getCurrentClient: () => {
    return window.localStorage.getItem(USER_SESSION_STORAGE_KEY);
  },
  clear: () => {
    window.localStorage.removeItem(USER_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(JWT_EXPIRATION_DATE);
    window.sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(USER_TYPE);
    destroyCookie(undefined, USER_COOKIES_STORAGE_KEY)
  },
  acceptedTheUseCookies: (): boolean => {
    return Boolean(window.localStorage.getItem(ACCEPTED_THE_USE_COOKIES));
  },
  setAcceptedTheUseCookies: (accept: boolean): void => {
    window.localStorage.setItem(ACCEPTED_THE_USE_COOKIES, String(accept));
  },
  validateToken: (token: string): boolean => {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentDate = new Date().getTime();
    if (!decodedToken.exp) return false;
    if (currentDate > decodedToken.exp * 1000) {
      return false;
    }
    return true;
  },
};

const product = {
  clear: () => {
    window.localStorage.removeItem(USER_PRODUCTS_STORAGE_KEY);
  },
  save: (products: ProductResponseApi[]) => {
    window.localStorage.setItem(USER_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  },
}

const queryClient = new QueryClient();

export const CacheService = {
  user,
  product,
  queryClient,
};
