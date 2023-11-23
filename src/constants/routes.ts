export const ROUTES = {
  SIGN_IN: '/',
  DASHBOARD: '/dashboard',
  PRODUCTS: {
    CREATE: `/dashboard/products/create`,
    LIST: `/dashboard/products`,
    EDIT: (id: string | number) =>  `/dashboard/products/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/products/view/${id}`,
  },
  SUPPLIERS: {
    CREATE: `/dashboard/supplier/create`,
    LIST: `/dashboard/supplier`,
    EDIT: (id: string | number) =>  `/dashboard/supplier/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/supplier/view/${id}`,
  },
  STATUS: {
    CREATE: `/dashboard/order-status/create`,
    LIST: `/dashboard/order-status`,
    EDIT: (id: string | number) =>  `/dashboard/order-status/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/order-status/view/${id}`,
  },
  USERS: {
    CREATE: `/dashboard/users/create`,
    LIST: `/dashboard/users`,
    EDIT: (id: string | number) =>  `/dashboard/users/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/users/view/${id}`,
  },
  ORDERS: {
    CREATE: `/dashboard/orders/create`,
    LIST: `/dashboard/orders`,
    EDIT: (id: string | number) =>  `/dashboard/orders/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/orders/view/${id}`,
  },
  BRANDS: {
    LIST: `/dashboard/brand`,
    CREATE: `/dashboard/brand/create`,
    EDIT: (id: string | number) =>  `/dashboard/brand/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/brand/view/${id}`,
  },
  TUTORIALS: {
    LIST: `/dashboard/tutorials`,
    CREATE: `/dashboard/tutorials/create`,
    EDIT: (id: string | number) =>  `/dashboard/tutorials/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/tutorials/view/${id}`,
  },
  COLORS: {
    LIST: `/dashboard/color`,
    CREATE: `/dashboard/color/create`,
    EDIT: (id: string | number) =>  `/dashboard/color/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/color/view/${id}`,
  },
  CATEGORIES: {
    CREATE: `/dashboard/category/create`,
    LIST: `/dashboard/category`,
    EDIT: (id: string | number) =>  `/dashboard/category/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/category/view/${id}`,
  },
  CART: {
    ROOT: `/dashboard/products/cart`,
    PAYMENT: (id: string | number ) => `/dashboard/products/cart/payment/${id}`,
  },
  SALE: {
    ROOT: `/dashboard/sales`,
    PAYMENT: (id: string | number ) => `/dashboard/products/cart/payment/${id}`,
  },
  MY_PROFILE: {
    ROOT: (params: string) => `/dashboard/my-profile?${params}`,
  },
  SUBSCRIPTION: {
    ROOT: `/dashboard/subscription`,
  },
};

export const RAW_ROUTES = {
  ACTIVITY: '/a/[pid]',
};
