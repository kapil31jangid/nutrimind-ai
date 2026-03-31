# Stage 1: Build the Next.js frontend
FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Python environment and run FastAPI
FROM python:3.11-slim

WORKDIR /app

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI app code
COPY backend/ ./

# Copy compiled Next.js static files to 'out' directory
COPY --from=builder /app/frontend/out ./out

# Expose port (Cloud Run sets PORT env var)
ENV PORT 8080

# Start Uvicorn
CMD sh -c "uvicorn api:app --host 0.0.0.0 --port $PORT"
