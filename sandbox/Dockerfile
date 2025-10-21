FROM python:3.11-slim
RUN useradd -m -u 1000 sandbox
USER sandbox
WORKDIR /home/sandbox
ENV PYTHONUNBUFFERED=1
RUN python -c "import sys; print(sys.version)"