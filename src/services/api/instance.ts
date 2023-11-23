import axios, { AxiosError } from 'axios';
import { ROUTES } from '@/constants/routes';
import { CacheService } from '@/services/cache';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
//   if (error?.config?.headers?.Authorization) {
//     const token = error.config.headers.Authorization as string
//     const isValid = CacheService.user.validateToken(token.split(' ')[1])
//     if (!isValid) {
//       window.location.href = ROUTES.HOME
//       error.message = 'Sessão invalida, faça login novamente'
//     }
//   }
//   if (error.status === 401) {
//     window.location.href = ROUTES.HOME
//     error.message = 'Sessão invalida, faça login novamente'
//   }

//   return Promise.reject(error)
// })

export default axiosInstance;
