import { z } from 'zod';

/**
 * Общие типы и схемы валидации для всего монорепо
 */

// Базовые схемы
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const DateTimeSchema = z.string().datetime();

// Пользователь
export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export type User = z.infer<typeof UserSchema>;

// API ответы
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    meta: z
      .object({
        timestamp: DateTimeSchema,
        requestId: z.string().uuid(),
      })
      .optional(),
  });

export type ApiResponse = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodTypeAny>>>;

// Пагинация
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ApiResponseSchema(
    z.object({
      items: z.array(itemSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    })
  );

// Утилиты
export function createApiResponse<T>(data: T, requestId?: string) {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId ?? crypto.randomUUID(),
    },
  };
}

export function createApiError(error: string, requestId?: string) {
  return {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId ?? crypto.randomUUID(),
    },
  };
}

// Типы для окружения
export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, string | undefined>): Env {
  return EnvSchema.parse(config);
}
