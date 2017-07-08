#### - [ Developed by Creative At Work ](http://creativeatwork.net)

#### - Bank Application -
Practical bank application project for superficial brand name UBANK. A fully responsive cross browser application using Angular 1.6 MVC framework with OOP/Typescript and RESTFul API/ and data retrieval. Backend mongodb/mongoose ORM with CRUD. Multer for uploading and storing files for retrieval.
You can register as new user, and return later to complete the application..
* A fully automated Gulp task runner with browsersync proxy to nodemon.
* Access to Bootstrap sass configuration using global.vars with the help of 'Wiredeb' package.
* All files are rendered using view HTML engine.
* Fully documented.
* JSHINT, TSLINT 

[ Link to Application video preview ](http://creativeatwork.net/portfolio/bank-application-angular-mongodb/)


###### Instalation
* You need to **install mongoDB** before running this application. Instructions to install on your OS here:
  https://docs.mongodb.com/manual/installation/
  make sure you assing mongod to global path, or run it from the /bin folder, and assing new database path.
* If you have problems with Sass run **$/ npm run fix** to rebuild
* **npm install will** will install all node_modules and bower_components.

```
#!python

$/ npm install
```

***
###### Start the App
* Once you run it and have installed, configured your mongodb, it will automaticly run the process for you, 
  proxyfy and start the nodemon server, and launch Chorme as default browser.
* Generated files are stored in the ./public dir along with bower_components.
* The npm task runner/gulp uses Wiredeb to dynamicly inject files generated in ./public/index.html
* The server/backed is in ./server dir, some of the configuration is shared from the main 
  ./config.js file, such as port.

```
#!python
# in this order.

$/ mongod #or mongod --dbpath /to/data
$/ npm start
```

##### Optional
* You can populate DB with dummy data from provided json ./server/config/initial_data.json
  just run **http://localhost:8080/api/createnew**
  and use the 'token' as your application number.

***
##### Stack/Setup
* Angular 1.6/component, BootStrap alpha.6/Flexbox, Sass, Typescript, nodejs/Express, Lodash, MongoDB/mongoose
  Multer, npm/gulp, nodemon/ browserSync as proxy, dynamic injection and sass globals configuration with Wiredeb.
  tslint/jshint, server RESTful API, data retrieval
* Following John Papa Angular Style Guide
* Integraded in modular fashion
* Coded in OOP
***


##### File structure

##### **APP**
![App dir](http://creativeatwork.net/git_images/app.dir.screen.png)

##### **SERVER**
![Server dir](http://creativeatwork.net/git_images/app.server.dir.screen.png)


```
#!python

     /**
       *  The data flow of this app is:
       *  Layout  <<< GLOBALS
       *     > page component  <<< $dataservice
       */
```

***

##### -- Remarks --
* Tested and works without bugs on lates Chrome and Firefox, not tested on IE(SORRY!).
* All files are well documented.
* you can preview a working app video via this link   **http://creativeatwork.net/portfolio/bank-application-angular-mongodb/**
* If your server crashed and you get this error in the CLI **Error: listen EADDRINUSE :::8018**
  you will have to change the port in the ./config.js file
***

###### TODOS ?
* No persistant cache included as yet, only DATA retrieval.
* User authentication not yet intergated.

***

##### Thank you