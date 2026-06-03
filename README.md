# TrustRoute Scan

Separate React Native app for **counter staff** — scan a customer's rotating Business QR and send a channel subscription request via the Business API.

Not part of the consumer `mobile/` app.

## Screens

| Screen | Purpose |
|--------|---------|
| Login | API key (`x-api-key`) stored in Keychain |
| Home | Scan CTA, active channel, today's scans |
| Scanner | Full-screen camera → `POST /subscriptions/scan` |
| Channel selector | Pick channel (Order Updates, Promotions, …) |
| Scan history | Local history + status sync from API |

## Configuration

Edit `src/config/api.config.ts`:

```ts
// Android emulator → host machine business-api
export const BUSINESS_API_HOST = '10.0.2.2';
export const BUSINESS_API_PORT = 3002;
export const BUSINESS_API_HTTPS = false;

// Physical device on same Wi‑Fi → your Mac's LAN IP
// export const BUSINESS_API_HOST = '192.168.1.x';
```

Production: point `BUSINESS_API_HOST` / port at your deployed `business-api` service (Railway, etc.).

## QR format (customer phone)

The scanner accepts:

- Raw UUID token from `GET /users/me/business-qr`
- `trustroute://biz/{token}` deep link

The consumer TrustRoute app should display one of these (60s rotation). Until that UI ships, you can test with a QR generator using a valid token from the API.

## Run

```bash
cd business-scan
npm install
npm start          # Metro (port 8082 if 8081 is used by mobile)
npm run android
```

Start backend:

```bash
cd backend && npm run dev:business-api
```

## Auth

1. Register business → admin approves → copy `api_key` once.
2. Paste into Scan app login.
3. Key persists in secure storage until sign out.
