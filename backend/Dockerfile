FROM python:3.11-slim

WORKDIR /backend
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /backend/app

EXPOSE 8000

# Use ARG to define build-time variable for environment
ARG ENV=development
ENV ENVIRONMENT=${ENV}

# Conditional CMD based on environment
CMD if [ "$ENVIRONMENT" = "production" ]; then \
        fastapi run main.py --host 0.0.0.0 --port 8000; \
    else \
        fastapi dev main.py --host 0.0.0.0 --port 8000; \
    fi