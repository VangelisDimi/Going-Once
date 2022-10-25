FROM python:3.8.10-alpine
WORKDIR /app
RUN apk add gcc musl-dev libffi-dev openssl-dev python3-dev libxml2 libxslt-dev cargo postgresql-dev jpeg-dev zlib-dev
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python","manage.py","runsslserver","--certificate","./ssl/cert.pem","--key","./ssl/key.pem"]