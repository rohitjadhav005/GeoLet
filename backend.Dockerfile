FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn

# Copy application code
COPY api /app/api

EXPOSE 8000

# Start server
CMD ["uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "8000"]
