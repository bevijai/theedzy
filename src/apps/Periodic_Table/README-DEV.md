Developer run notes

This project includes a local mock "Ask Professor" API and a Vite-powered React app.

Quick start (Windows PowerShell)

1) Install dependencies:

   npm install

2) Start the mock server (serves /api/llm):

   npm run server

3) In a separate terminal start the Vite dev server:

   npm run dev

4) Open the app in the browser (Vite will show URL, commonly http://localhost:5173)

5) Use the Playground: drag elements into the reaction area and click "Ask Professor" to query the mock API.

Notes & security

- .env is used for local configuration. The file should remain local and must not be committed to source control. The repository's .gitignore already excludes .env.
- If an API key was accidentally committed or exposed, rotate the key immediately with the provider.
- For production LLM usage, implement a secure server with provider credentials stored in a secrets manager. Never expose provider keys to the client.

Troubleshooting

- If "Professor service unavailable" appears in the UI, confirm the mock server is running and listening on the port defined in .env (default 4000). Use:

   Test-NetConnection -ComputerName localhost -Port 4000
   or
   Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/llm -ContentType 'application/json' -Body (ConvertTo-Json @{ elements = @('O','F'); depth = 'short' })

- If you see CORS or mixed-content errors, restart the Vite dev server (it proxies /api/llm to the mock server during development). See vite.config.ts for proxy configuration.

Contact

If you hit errors, copy terminal output and browser console/network logs into an issue and I'll help fix them.
