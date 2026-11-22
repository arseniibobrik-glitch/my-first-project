import { describe, it, expect } from "bun:test";
import {
  UserSchema,
  createApiResponse,
  createApiError,
  validateEnv,
  PaginationQuerySchema,
  IdSchema,
  EmailSchema,
} from "./index";

describe("shared package", () => {
  describe("UserSchema", () => {
    it("валидирует корректного пользователя", () => {
      const user = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "test@example.com",
        name: "Test User",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      };
      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it("отклоняет невалидный email", () => {
      const user = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "not-an-email",
        name: "Test User",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      };
      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(false);
    });

    it("отклоняет невалидный UUID", () => {
      const user = {
        id: "not-a-uuid",
        email: "test@example.com",
        name: "Test User",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      };
      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(false);
    });
  });

  describe("createApiResponse", () => {
    it("создаёт успешный ответ с данными", () => {
      const response = createApiResponse({ foo: "bar" }, "test-request-id");
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ foo: "bar" });
      expect(response.meta?.requestId).toBe("test-request-id");
      expect(response.meta?.timestamp).toBeDefined();
    });
  });

  describe("createApiError", () => {
    it("создаёт ответ с ошибкой", () => {
      const response = createApiError("Something went wrong", "test-request-id");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Something went wrong");
      expect(response.meta?.requestId).toBe("test-request-id");
    });
  });

  describe("validateEnv", () => {
    it("парсит корректные переменные окружения", () => {
      const env = validateEnv({
        NODE_ENV: "development",
        PORT: "3000",
      });
      expect(env.NODE_ENV).toBe("development");
      expect(env.PORT).toBe(3000);
    });

    it("использует дефолты", () => {
      const env = validateEnv({});
      expect(env.NODE_ENV).toBe("development");
      expect(env.PORT).toBe(3000);
    });
  });

  describe("PaginationQuerySchema", () => {
    it("парсит query параметры с дефолтами", () => {
      const result = PaginationQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data?.page).toBe(1);
      expect(result.data?.limit).toBe(20);
      expect(result.data?.order).toBe("desc");
    });

    it("парсит кастомные значения", () => {
      const result = PaginationQuerySchema.safeParse({
        page: "2",
        limit: "50",
        sort: "name",
        order: "asc",
      });
      expect(result.success).toBe(true);
      expect(result.data?.page).toBe(2);
      expect(result.data?.limit).toBe(50);
      expect(result.data?.sort).toBe("name");
      expect(result.data?.order).toBe("asc");
    });
  });

  describe("IdSchema", () => {
    it("принимает валидный UUID", () => {
      expect(IdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
    });
    it("отклоняет невалидный UUID", () => {
      expect(IdSchema.safeParse("not-a-uuid").success).toBe(false);
    });
  });

  describe("EmailSchema", () => {
    it("принимает валидный email", () => {
      expect(EmailSchema.safeParse("test@example.com").success).toBe(true);
    });
    it("отклоняет невалидный email", () => {
      expect(EmailSchema.safeParse("not-an-email").success).toBe(false);
    });
  });
});