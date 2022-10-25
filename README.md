# Going Once
A full stack online auction site made using React,Django,Bootstrap and PostgreSQL.

## Setup
1. `docker-compose build`
2. `DB_PASSWORD=$(cat ./backend/secrets.json | jq -r '.DB_PASSWORD') docker-compose up`  
    or  
    ```
    DB_PASSWORD=$(cat ./backend/secrets.json | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['DB_PASSWORD'])") docker-compose up
    ```