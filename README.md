# 0x15. Files manager

## Learning Objectives
The objective is to build a simple platform to upload and view files:

   - User authentication via a token
   - List all files
   - Upload a new file
   - Change permission of a file
   - View a file
   - Generate thumbnails for images

Also, to fully understand these concepts:

   - how to create an API with Express
   - how to authenticate a user
   - how to store data in MongoDB
   - how to store temporary data in Redis
   - how to setup and use a background worker

## Tasks
### [0. Redis utils](./utils/redis.js)
Inside the folder utils, create a file redis.js that contains the class RedisClient.

RedisClient should have:

   - the constructor that creates a client to Redis
   - a function isAlive that returns true when the connection to Redis is a success otherwise, false
   - an asynchronous function get that takes a string key as argument and returns the Redis value stored for this key
   - an asynchronous function set that takes a string key, a value and a duration in second as arguments to store it in Redis (with an expiration set by the duration argument)
   - an asynchronous function del that takes a string key as argument and remove the value in Redis for this key

After the class definition, create and export an instance of RedisClient called redisClient.
```
bob@dylan:~$ cat main.js
import redisClient from './utils/redis';

(async () => {
    console.log(redisClient.isAlive());
        console.log(await redisClient.get('myKey'));
    await redisClient.set('myKey', 12, 5);
    console.log(await redisClient.get('myKey'));

    setTimeout(async () => {
        console.log(await redisClient.get('myKey'));
    }, 1000*10)
})();

bob@dylan:~$ npm run dev main.js
true
null
12
null
bob@dylan:~$ 
```

### [1. MongoDB utils](./utils/db.js)
Inside the folder utils, create a file db.js that contains the class DBClient.

DBClient should have:

   - the constructor that creates a client to MongoDB:
       - host: from the environment variable DB_HOST or default: localhost
       - port: from the environment variable DB_PORT or default: 27017
       - database: from the environment variable DB_DATABASE or default: files_manager
   - a function isAlive that returns true when the connection to MongoDB is a success otherwise, false
   - an asynchronous function nbUsers that returns the number of documents in the collection users
   - an asynchronous function nbFiles that returns the number of documents in the collection files

After the class definition, create and export an instance of DBClient called dbClient.
```
bob@dylan:~$ cat main.js
import dbClient from './utils/db';

(async () => {
    console.log(dbClient.isAlive());
    console.log(await redisClient.nbUsers());
    console.log(await redisClient.nbFiles());
})();

bob@dylan:~$ npm run dev main.js
true
4
30
bob@dylan:~$ 
```