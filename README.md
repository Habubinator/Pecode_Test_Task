# Pecode Test Task

This repositry contains test task for Pecode company

## Installation

Download [zip file](https://github.com/Habubinator/Pecode_Test_Task/archive/refs/heads/main.zip) of repository or clone it with terminal.

```bash
git clone https://github.com/Habubinator/Pecode_Test_Task
cd Pecode_Test_Task
```

Use the package manager [npm](https://www.npmjs.com/) to init packages.

```bash
npm i
```

Update .env file from .env.sample.

```env
# Connect to database via connection pooling.
DATABASE_URL=""
# Direct connection to the database. Used for migrations.
DIRECT_URL=""
# Any secret phrase
JWT_SECRET_KEY=""
JWT_TTL="24h"
PORT="5000"
```

Update packages.

```bash
npm i
```

Build JavaScript from TypeScript

```bash
npm run build
npm start
```

## Usage

### POST /user/register

#### body:

```json
{
    "username": "rootAuthor",
    "password": "12345",
    "email": "example@gmail.com"
}
```

#### responce:

```json
{
    "success": true,
    "data": {
        "email": "example@gmail.com",
        "accessToken": "...",
        "refreshToken": "..."
    }
}
```

### POST /user/login

#### body:

```json
{
    "password": "12345",
    "email": "example@gmail.com"
}
```

#### responce:

```json
{
    "success": true,
    "data": {
        "email": "example@gmail.com",
        "accessToken": "...",
        "refreshToken": "..."
    }
}
```

### GET /user/one

Include Authorization with **Bearer Token |YOUR TOKEN|**

#### body:

```json
{
    "id": 1
}
```

#### responce:

```json
{
    "success": true,
    "data": {
        "candidate": {
            "id": 1,
            "username": "rootAuthor",
            "email": "example@gmail.com",
            "hashed_password": "$2b$10$sqFRbGHYD90FG8KYfTeZrOm/BhbuBQitAVIPymZZd0ww2ANWvF5PW",
            "refresh_token": "...",
            "posts": [
                {
                    "id": 1,
                    "created_by": 1,
                    "post": "Это тестовый пост!"
                }
            ]
        }
    }
}
```

### GET /post/all

Include Authorization with **Bearer Token |YOUR TOKEN|**

#### body: **empty**

#### responce:

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "created_by": 1,
            "post": "Это тестовый пост!"
        }
    ]
}
```

### POST /post/create

Include Authorization with **Bearer Token |YOUR TOKEN|**

#### body:

```json
{
    "post": "Это тестовый пост!"
}
```

#### responce:

```json
{
    "success": true,
    "data": {
        "userPost": {
            "id": 1,
            "created_by": 1,
            "post": "Это тестовый пост!"
        }
    }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
