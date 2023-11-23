import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const createSchema = z
  .object({
    nome: z.string().nonempty(REQUIRED_MESSAGE),
    descricao: z.string().nonempty(REQUIRED_MESSAGE),
    subCategories: z.array(z.object({
      nome: z.string().nonempty(REQUIRED_MESSAGE)
    })).optional(),
  })
