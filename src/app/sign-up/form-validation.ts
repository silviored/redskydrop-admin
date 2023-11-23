import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const createUserSchema = z
  .object({
    nome: z.string().nonempty(REQUIRED_MESSAGE),
    email: z.string().email('Email inválido').nonempty(REQUIRED_MESSAGE),
    password: z.string().nonempty(REQUIRED_MESSAGE),
    password_confirmation: z.string().nonempty(REQUIRED_MESSAGE),
  })
  .refine(
    ({ password_confirmation, password }) => password_confirmation === password,
    {
      message: 'As senha devem ser iguais',
      path: ['password_confirmation'],
    }
  );
