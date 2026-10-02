# Convestigate

## Run locally

Open a terminal in this project directory and start the FastAPI backend:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --host 127.0.0.1 --port 8000
```

The API health check is available at <http://127.0.0.1:8000/> and the
interactive API documentation is at <http://127.0.0.1:8000/docs>.

In a second terminal, still in the project directory, serve the frontend and
open <http://127.0.0.1:5500>:

```powershell
python -m http.server 5500 --directory frontend
```

Do not open `frontend/index.html` as a `file://` URL; browsers restrict module
scripts and API requests from local files.

The frontend defaults to `http://127.0.0.1:8000`. For a deployed frontend,
define `window.CONVESTIGATE_API_URL` before `frontend/js/app.js` loads, pointing
it at the deployed FastAPI origin. The backend allows cross-origin requests.
`GEMINI_API_KEY` is optional for local gameplay; without it, the game runs with
the AI advisor in offline mode.

## Deploy to Render

The root `render.yaml` Blueprint creates the FastAPI backend and static game
frontend together. In Render, choose **New → Blueprint**, connect this GitHub
repository, and select the `dhwani-ai` branch. Render connects the frontend to
the backend URL automatically. The AI advisor works in offline mode unless
`GEMINI_API_KEY` is added to the backend service environment.
