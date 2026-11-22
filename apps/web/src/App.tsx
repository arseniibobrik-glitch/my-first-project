import { useState, useEffect } from 'react';
import { type User } from '@my-project/shared';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка пользователей (демо: мок)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // В продакшне: await fetch("/api/users").then(r => r.json())
      await new Promise((r) => setTimeout(r, 500));
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
      setUsers(mockUsers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">My Web App</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Монорепо демо</span>
              <button
                onClick={() => void fetchUsers()}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Загрузка...' : 'Обновить'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Всего пользователей" value={users.length} icon="👥" />
          <StatCard title="Активных сегодня" value={Math.floor(Math.random() * 10)} icon="🟢" />
          <StatCard title="Новых за неделю" value={Math.floor(Math.random() * 5)} icon="📈" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Пользователи</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Аватар
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Просмотр</button>
                      <button className="text-red-600 hover:text-red-900">Удалить</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Пользователей не найдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Работает на <strong>React + Vite + Tailwind</strong> в монорепо
          </p>
          <p className="mt-1">
            Деплой: <strong>GitHub Pages</strong> (бесплатно)
          </p>
        </div>
      </main>
    </div>
  );
}

// Статистическая карточка
function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default App;
