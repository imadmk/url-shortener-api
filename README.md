# Simple API Timestamp Microservice

## Versions

Create a file named `.env` in the root directory. This file should contain:

```
MONGO_URI=mongodb://localhost:27017/apidatabase
PORT=8080
APP_URL=http://localhost:8080/
```

### Starting the App

`node server.js` 

### Heroku app

url-shortener-imadmk.herokuapp.com

### Using this app

     User stories:

        1) I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

        2) If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

        3) When I visit that shortened URL, it will redirect me to my original link.

Example creation usage:

https://url-shortener-imadmk.herokuapp.com/new/https://www.google.com
https://url-shortener-imadmk.herokuapp.com/new/http://freecodecamp.com/news

Example creation output:

{ "original_url": "http://freecodecamp.com/news", "short_url": "https://url-shortener-imadmk.herokuapp.com/4" }

Usage:

https://url-shortener-imadmk.herokuapp.com/4

Will redirect to:

http://freecodecamp.com/news