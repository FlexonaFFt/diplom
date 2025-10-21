# Контест + Авторизация (Backend)

Бэкенд объединяет систему аутентификации (JWT + SQLite) и модуль онлайн‑джаджа, который исполняет пользовательский код в изолированном Docker-контейнере.  
REST API построено на FastAPI, ORM — SQLAlchemy 2.0.

## Возможности
- Регистрация, логин, refresh токены (`/api/kontest/auth/*`).
- Проверка статуса текущей сессии и logout.
- CRUD для задач контеста (кейсов) с тестами.
- Отправка решений и хранение результатов по каждому тесту.
- Выполнение пользовательского Python-кода внутри sandbox-образа с лимитами CPU/памяти/процессов.

## Быстрый старт с Docker

```bash
# 1. Перейти в корень репозитория
cd /Users/vladimirriasnoi/Desktop/Uni/ML/Диплом/diplom

# 2. Собрать sandbox-образ (используется для запуска пользовательского кода)
docker build -t judge-python:1.0 sandbox

# 3. Собрать и запустить сервисы
docker compose build
docker compose up
```

Что происходит:
- `sandbox_image` готовит образ `judge-python:1.0` и завершает работу (это нормально).
- `backend` стартует на `http://localhost:8000` и получает доступ к докеру через `/var/run/docker.sock`.
- `frontend` поднимается на `http://localhost:5173`, обращаясь к API по `http://localhost:8000`.

Остановить можно `Ctrl+C`, затем при необходимости `docker compose down`.

## Локальный запуск (без Docker)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Переменные окружения (пример)
export DATABASE_URL=sqlite:///./auth.db
export JUDGE_IMAGE=judge-python:1.0
export WORKDIR_HOST=/tmp/judge-workdir

# Собрать sandbox-образ однократно
cd ../sandbox
docker build -t judge-python:1.0 .

# Запустить API
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Основные эндпоинты

| Маршрут | Описание |
| --- | --- |
| `GET /docs` | Swagger UI |
| `GET /api/kontest/auth/status` | Проверка доступности auth-сервиса |
| `POST /api/kontest/auth/register` | Регистрация пользователя |
| `POST /api/kontest/auth/login` | Получение access+refresh токенов |
| `POST /api/kontest/auth/refresh` | Обновление access токена |
| `GET /api/kontest/auth/me` | Статус текущей сессии |
| `POST /api/kontest/judge/cases` | Создание кейса (нужен access token) |
| `GET /api/kontest/judge/cases` | Список кейсов |
| `POST /api/kontest/judge/submit` | Отправка решения (нужен access token) |
| `GET /api/kontest/judge/submissions` | История посылок (нужен access token) |

Полные схемы данных см. в `app/judge_schemas.py`.

## Конфигурация

Все значения читаются через `python-decouple`:

| Переменная | Назначение | Значение по умолчанию |
| --- | --- | --- |
| `DATABASE_URL` | Подключение к БД | `sqlite:///./auth.db` |
| `SECRET_KEY`, `ALGORITHM` | Подпись JWT | `your-super-secret-key...`, `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS` | TTL токенов | `30`, `7` |
| `APP_NAME`, `DEBUG` | Метаданные приложения | `AuthKeyHub`, `False` |
| `JUDGE_IMAGE` | Имя sandbox-образа | `judge-python:1.0` |
| `PER_TEST_TIMEOUT_SEC` | Таймаут на тест | `2` |
| `MEM_LIMIT`, `NANO_CPUS`, `PIDS_LIMIT` | Лимиты контейнера | `256m`, `500000000`, `64` |
| `WORKDIR_HOST` | Хостовая директория для временных файлов | `/tmp/judge-workdir` |

Для Docker Compose соответствующие переменные уже прокинуты в `docker-compose.yml`.

## Важные детали
- Перед запуском убедитесь, что Docker демон доступен и пользователь имеет права на `/var/run/docker.sock`.
- Рабочая директория `WORKDIR_HOST` должна существовать (например, `mkdir -p /tmp/judge-workdir`).
- Sandbox контейнер запускается в `network_mode=none`, с `read_only` и `cap_drop=ALL`.
- В базе создаются таблицы `users`, `cases`, `test_cases`, `submissions`, `submission_tests`.

## Разработка
- Для быстрой перезагрузки в локальном режиме используйте `uvicorn main:app --reload`.
- Тестовые запросы удобно выполнять через Swagger UI (`/docs`) либо коллекцию в Postman/HTTP клиенте.
- Frontend по умолчанию ожидает, что API доступен на `http://localhost:8000`. При изменении адреса обновите `VITE_AUTH_API_BASE` и `VITE_JUDGE_API_BASE`.
