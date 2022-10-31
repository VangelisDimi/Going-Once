# Going Once
A full stack online auction site made using React,Django,Bootstrap and PostgreSQL.
<p float="left">
  <img src="https://github.com/VangelisDimi/Going-Once/blob/main/screenshots/Screenshot_20221031_120339.png" width="500" />
  <img src="https://github.com/VangelisDimi/Going-Once/blob/main/screenshots/Screenshot_20221031_120601.png" width="500" /> 
  <img src="https://github.com/VangelisDimi/Going-Once/blob/main/screenshots/Screenshot_20221031_121601.png" width="500" />
  <img src="https://github.com/VangelisDimi/Going-Once/blob/main/screenshots/Screenshot_20221031_121739.png" width="500" />
  <img src="https://github.com/VangelisDimi/Going-Once/blob/main/screenshots/Screenshot_20221031_122114.png" width="500" />
</p>

## Setup
### SSL certificates
1. Create a folder in the /frontend and in the /backend directory named `ssl`.
2. In each folder place a file named `cert.pem` with the ssl certificate and a file named `key.pem` with the ssl key.  

You can create the certificates with a tool like [mkcert](https://github.com/FiloSottile/mkcert).

### Secrets
Create a file in the /backend directory named `secrets.json`.  
The file must have the following format:  
```json
{
    "SECRET_KEY": "<Django secret key>",
    "DB_PASSWORD": "<Database password>",
    "ADMIN_PASSWORD": "<Initial website admin password>"
}
```

### Start the application
1. `docker-compose build`
2. `DB_PASSWORD=$(cat ./backend/secrets.json | jq -r '.DB_PASSWORD') docker-compose up`  
    or  
    ` DB_PASSWORD=$(cat ./backend/secrets.json | python3 -c "import sys, json; print(json.load(sys.stdin)['DB_PASSWORD'])") docker-compose up `

### Create the initial admin user
1. Open terminal to backend container:  
`docker exec -ti backend sh`  
2. Create initial admin user:  
`python manage.py createadmin`

The password of the admin is on the `secrets.json` file , the username of the admin is `admin` (you can change it on `/backend/users/management/createadmin.py`).  
The credentials can be used on the admin site and on the Django management page.

## Usage
Site can be accessed at https://localhost:3000/.  
Admin site can be accessed at https://localhost:3000/admin.
