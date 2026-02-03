# Environment variables (backend) ✅

This project uses Vite environment variables. Any variable you want to expose to the client must be prefixed with `VITE_`.

- Local/dev: create a `.env` file in the `frontend` folder and set:

```
VITE_API_URL="http://localhost:8095/api"
```

- Production: either create `.env.production` or set the `VITE_API_URL` variable in your CI/CD/deployment environment to your hosted backend:

```
VITE_API_URL="https://your-backend.example.com/api"
```

This project already reads `VITE_API_URL` in `src/services/api.js` and falls back to `http://localhost:8095/api` if the env var is not set.

See `.env.example` for an example file.
