import {z} from 'zod';

export const LOCALES = ['en', 'es'] as const;

export const Locale = z.enum(LOCALES);

export type Locale = z.infer<typeof Locale>;
