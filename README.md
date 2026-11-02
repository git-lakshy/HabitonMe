# HabitonMe

Habit tracker with an Expo (React Native) client and a FastAPI sync backend.

## Stack

- **Frontend:** Expo Router, React Native, AsyncStorage, local streak/progress UI
- **Backend:** FastAPI, SQLAlchemy, SQLite/Postgres via the configured engine
- **Sync:** device-token users; habits and daily completions push/pull through `POST /sync`

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API highlights:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | health / welcome |
| POST | `/users/` | register or update a device-token user |
| POST | `/sync` | upsert habits + completions, return server state |
| POST | `/test-notification` | queue a reminder stub (FCM placeholder) |

Models: `User` (device token, notification time, timezone), `Habit`, `Completion`.

## Frontend

```bash
cd frontend
npm install
npx expo start
```

Tabs cover today’s habits, explore, progress, and settings. Offline-friendly storage lives in the app; `SyncService` talks to the API when available.

## Notes

- Conflict resolution on sync currently prefers client-supplied habit fields.
- Push notifications are stubbed (`send_daily_reminder`); wire `firebase-admin` before relying on them in production.
