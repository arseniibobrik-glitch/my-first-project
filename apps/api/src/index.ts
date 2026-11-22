import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import {
  createApiResponse,
  createApiError,
  validateEnv,
  type User,
  UserSchema,
  PaginationQuerySchema,
} from '@my-project/shared';

// Типы для Cloudflare Workers
type Bindings = {
  DB?: D1Database;
  CACHE?: KVNamespace;
};

type Variables = {
  requestId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://*.pages.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request ID middleware
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID());
  await next();
});

// Валидация окружения (side-effect: throws on invalid)
validateEnv(process.env as Record<string, string | undefined>);

// In-memory store для демо (в продакшене — D1/KV)
const usersStore = new Map<string, User>();

// Инициализация мок-данных
function initMockUsers() {
  const mockUsers: User[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'alice@example.com',
      name: 'Алиса',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'bob@example.com',
      name: 'Боб',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'charlie@example.com',
      name: 'Чарли',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z',
    },
  ];
  mockUsers.forEach((u) => usersStore.set(u.id, u));
}
initMockUsers();

// Health check
app.get('/health', (c) => {
  return c.json(createApiResponse({ status: 'ok', timestamp: new Date().toISOString() }), 200);
});

// GET /api/users - список пользователей с пагинацией
app.get('/api/users', (c) => {
  try {
    const query = PaginationQuerySchema.parse(c.req.query());
    const allUsers = Array.from(usersStore.values());

    // Сортировка
    if (query.sort) {
      const sortKey = query.sort as keyof User;
      allUsers.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null || bVal == null) return 0;
        if (aVal < bVal) return query.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return query.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Пагинация
    const start = (query.page - 1) * query.limit;
    const items = allUsers.slice(start, start + query.limit);
    const total = allUsers.length;

    const response = createApiResponse(
      {
        items,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
      c.get('requestId')
    );

    return c.json(response, 200);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Validation error';
    return c.json(createApiError(error, c.get('requestId')), 400);
  }
});

// GET /api/users/:id - получить пользователя
app.get('/api/users/:id', (c) => {
  const id = c.req.param('id');
  const user = usersStore.get(id);

  if (!user) {
    return c.json(createApiError('User not found', c.get('requestId')), 404);
  }

  return c.json(createApiResponse(user, c.get('requestId')), 200);
});

// POST /api/users - создать пользователя
app.post('/api/users', async (c) => {
  try {
    const body = await c.req.json();
    const userData = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(body);

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.set(newUser.id, newUser);

    return c.json(createApiResponse(newUser, c.get('requestId')), 201);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid input';
    return c.json(createApiError(error, c.get('requestId')), 400);
  }
});

// PUT /api/users/:id - обновить пользователя
app.put('/api/users/:id', async (c) => {
  const id = c.req.param('id');
  const existing = usersStore.get(id);

  if (!existing) {
    return c.json(createApiError('User not found', c.get('requestId')), 404);
  }

  try {
    const body = await c.req.json();
    const userData = UserSchema.omit({ id: true, createdAt: true }).partial().parse(body);

    const updated: User = {
      ...existing,
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    usersStore.set(id, updated);

    return c.json(createApiResponse(updated, c.get('requestId')), 200);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid input';
    return c.json(createApiError(error, c.get('requestId')), 400);
  }
});

// DELETE /api/users/:id - удалить пользователя
app.delete('/api/users/:id', (c) => {
  const id = c.req.param('id');
  const deleted = usersStore.delete(id);

  if (!deleted) {
    return c.json(createApiError('User not found', c.get('requestId')), 404);
  }

  return c.json(createApiResponse({ success: true }, c.get('requestId')), 200);
});

// 404 handler
app.notFound((c) => {
  return c.json(createApiError('Route not found', c.get('requestId')), 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(createApiError('Internal server error', c.get('requestId')), 500);
});

export default app;
export type AppType = typeof app;
