import {z} from 'zod';

export const Locale = z.enum(['en', 'es'])

export type Locale = z.infer<typeof Locale>;
