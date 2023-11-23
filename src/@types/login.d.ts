type LoginApiRequest = {
  username: string;
  password: string;
};

type LoginApiResponse = {
  accessToken?: string;
  token?: string;
  user: UserResponseApi;
};

type ChangePasswordRequest = {
  password: string;
};

type ResetPasswordRequest = {
  token: string;
  password: string;
  passwordConfirmation: string;
};
