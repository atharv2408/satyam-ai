FROM python:3.9

WORKDIR /code

# Copy requirements first to cache installation
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Create a writable directory for the cache (required for HF Spaces non-root user)
RUN mkdir -p /code/.cache && chmod 777 /code/.cache
ENV TRANSFORMERS_CACHE=/code/.cache

# Copy the rest of the application
COPY . /code

# Create empty local db if needed (as fallback) and ensure it's writable
RUN touch /code/satyam.db && chmod 777 /code/satyam.db

# Hugging Face Spaces expects the app to run on port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
