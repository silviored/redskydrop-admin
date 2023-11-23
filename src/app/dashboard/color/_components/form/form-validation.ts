import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const createSchema = z
  .object({
    nome: z.string().nonempty(REQUIRED_MESSAGE),
    hex_code: z.string().optional(),
    product_id: z.string().optional(),
  })
