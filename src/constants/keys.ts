export const USER_SESSION_STORAGE_KEY = '@SkyDrop/user';
export const USER_COOKIES_STORAGE_KEY = '@SkyDrop/user';
export const USER_PRODUCTS_STORAGE_KEY = '@SkyDrop/products';
export const USER_REMEMBER_ME_STORAGE_KEY = '@SkyDrop/remember-me';
export const PUBLIC_TOKEN_SESSION_STORAGE_KEY = 'public-token';
export const JWT_EXPIRATION_DATE = '@user/token_validity';
export const ACCEPTED_THE_USE_COOKIES = '@user/acceptedTheUseCookies';
export const USER_DISMISS_NOTICE = '@user/dismissNotice';
export const USER_TYPE = '@user/type';
export const USER_UPDATED_TOAST_ID = '@user/toastErrorUpdated';

export const TOAST_CONTAINER_IDS = {
  NOTICE: 'notice',
};

export const TOAST_IDS = {
  IS_MINOR: 'IS_MINOR',
  NO_ACCEPTED_ENROLLMENT: 'NO_ACCEPTED_ENROLLMENT',
  HAS_RESERVATION: 'HAS_RESERVATION',
};

export const CLOSE_MODAL_EVENT = {
  CLOSE_ICON: 'close-icon',
};

export const STORAGE_KEYS = {
  LAST_USER: '@lastLogin',
};

export const QUERY_KEYS = {
  TOKEN: {
    GET: ['token'],
  },
  REPORT: {
    DASHBOARD: ['report-dashboard'],
  },
  PLANS: {
    LIST: ['plans'],
    GET: (id: string) => ['plans', id],
  },
  SUBSCRIPTIONS: {
    LIST: ['plans'],
    GET: (id: string) => ['plans', id],
    MY_SUBSCRIPTION: ['subscription-my-subscription'],
  },
  BRANDS: {
    LIST: ['plans'],
    GET: (id: string) => ['plans-get', id],
    UPDATE: (id: string) => ['brand-update', id],
  },
  TUTORIALS: {
    LIST: ['tutorials'],
    GET: (id: string) => ['tutorials-get', id],
    UPDATE: (id: string) => ['tutorials-update', id],
  },
  STATUS: {
    LIST: ['status'],
    GET: (id: string) => ['status-get', id],
    UPDATE: (id: string) => ['status-update', id],
  },
  SUPPLIERS: {
    LIST: ['suppliers'],
    GET: (id: string) => ['suppliers-get', id],
    UPDATE: (id: string) => ['suppliers-update', id],
  },
  COLORS: {
    LIST: ['colors'],
    LIST_BY_PRODUCT_ID:  (id?: string | number) => ['colors', id],
    GET: (id: string) => ['colors-get', id],
    UPDATE: (id: string) => ['colors-update', id],
  },
  CATEGORIES: {
    LIST: ['categories'],
    LIST_BY_PARENT: (id: string) => ['categories-list-by-parent', id],
    GET: (id: string) => ['categories-get', id],
    UPDATE: (id: string) => ['categories-update', id],
  },
  PRODUCTS: {
    LIST: ['products'],
    GET: (id: string) => ['products-get', id],
    UPDATE: (id: string | number) => ['products-update', id],
  },
  USERS: {
    LIST: ['users'],
    GET: (id: string) => ['users-get', id],
    REPORT_DASHBOARD: ['users-report-dashboard'],
    UPDATE: (id: string | number) => ['users-update', id],
  },
  ORDERS: {
    LIST: ['orders'],
    GET: (id: string) => ['order-get', id],
    VIEW: (id: string) => ['order-view', id],
    UPDATE: (id: string | number) => ['order-update', id],
  },
  SALES: {
    LIST: ['orders'],
    LIST_10: ['sales-10'],
    GET: (id: string) => ['order-get', id],
    VIEW: (id: string) => ['order-view', id],
    UPDATE: (id: string | number) => ['order-update', id],
  },
};
