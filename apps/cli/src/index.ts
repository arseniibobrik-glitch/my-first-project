#!/usr/bin/env bun
/**
 * My CLI - пример CLI утилиты на Bun + Commander
 * Использование: my-cli <command> [options]
 */

import { Command } from 'commander';
import { createApiResponse, validateEnv } from '@my-project/shared';

const program = new Command();

program.name('my-cli').description('CLI утилита для демонстрации монорепо').version('0.0.1');

// Глобальные опции
program.option('-v, --verbose', 'Подробный вывод').option('--json', 'Вывод в JSON');

// Команда: hello
program
  .command('hello')
  .description('Приветствие')
  .argument('[name]', 'Имя для приветствия', 'Мир')
  .option('-u, --uppercase', 'В верхнем регистре')
  .action((name, options) => {
    let greeting = `Привет, ${name}! 👋`;
    if (options.uppercase) greeting = greeting.toUpperCase();

    if (options.json) {
      console.log(JSON.stringify(createApiResponse({ greeting }), null, 2));
    } else {
      console.log(greeting);
    }
  });

// Команда: env
program
  .command('env')
  .description('Показать переменные окружения')
  .action((options) => {
    const env = validateEnv(process.env as Record<string, string | undefined>);
    if (options.json) {
      console.log(JSON.stringify(createApiResponse(env), null, 2));
    } else {
      console.table(env);
    }
  });

// Команда: generate
program
  .command('generate')
  .description('Генерация файлов/кода')
  .argument('<type>', 'Тип генерации (component, api-route, types)')
  .argument('[name]', 'Имя')
  .action((type, name, _options) => {
    console.log(`🔧 Генерация ${type}${name ? `: ${name}` : ''}...`);
    // Здесь будет логика генерации
    console.log('✅ Готово (заглушка)');
  });

// Обработка неизвестных команд
program.on('command:*', () => {
  console.error('❌ Неизвестная команда: %s', program.args.join(' '));
  program.help();
});

// Парсинг
program.parseAsync(process.argv).catch((err) => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});

// Если запущен без аргументов — показываем помощь
if (!process.argv.slice(2).length) {
  program.help();
}
