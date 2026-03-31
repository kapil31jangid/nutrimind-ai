# NutriMind AI – Smart Food Decision Assistant 🥗

NutriMind AI is a fast, scientifically-driven food recommendation assistant. Previously a CLI tool, it has been rewritten into a **Modern Web Application** (FastAPI + Next.js) tailored for seamless deployment on **Google Cloud Run**.

It helps you discover the healthiest food option within your budget by weighting protein, fat, and calories mathematically. It explains exactly *why* a particular food was chosen, and actively looks for a strictly healthier substitute.

---

## 🏗️ Architecture

- **Backend**: Python 3.11 with [FastAPI](https://fastapi.tiangolo.com/)
- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/) + [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS
- **Orchestration**: Multi-stage `Dockerfile` optimizing both layers into a single container image.

---

## 💻 Local Development

You can run the frontend and backend separately for an optimal DX.

### 1. Run the FastAPI Backend

```bash
cd backend
python -m venv venv
# On Windows use: .\venv\Scripts\activate
# On Mac/Linux use: source venv/bin/activate
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload --port 8080
```
Backend will run at `http://localhost:8080`.

### 2. Run the Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`.

---

## 🚀 Cloud Run Deployment

We have configured a multi-stage `Dockerfile` to build the Next.js frontend statically and serve it directly via the FastAPI backend. This allows you to host the entire full-stack application inside a **single Cloud Run Service**.

### Ensure Google Cloud SDK is setup

```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### Build and Deploy using Cloud Build

```bash
gcloud run deploy nutrimind-ai \
    --source . \
    --region us-central1 \
    --allow-unauthenticated
```
*Note: If building locally, you can use `docker build -t nutrimind-ai .` followed by a registry push.*

---

## 🧮 How It Works

1. **You enter a budget** (e.g., ₹200).
2. The engine filters the `data.json` database for affordable items.
3. It scores the affordable items mathematically: `(Protein * 2.0) - (Fat * 1.5) - (Calories / 10)`
4. The frontend visually highlights:
   - Your **Top Pick**.
   - A **reasoning** breakdown in plain English.
   - A **healthier swap** (a strictly better item that is still within your budget).
