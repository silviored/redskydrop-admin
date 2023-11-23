export type GlobalState = {
  user?: UserResponseApi;
  logged: boolean;
  saveUser: (currentUser: UserResponseApi) => void;
  logout: () => void;
};
