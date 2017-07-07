#### - [ Developed by Creative At Work ](http://creativeatwork.net)

#### - Bank Application -
A practical bank application for superficial brand name UBANK. A fully responvise cross browser 
application using Angular 1.6 MVC framework with OOP/Typescript and RESTFul API/ and data retreival. Backend mongodb/mongoose ORM with CRUD. Multer for uploading and storing files for retreival.
You can register as new user, and return later to complete the application.
- A fully automated Gulp task runner with browsersync proxy to nodemon.
- Access to Bootstrap sass configuration using global.vars with the help of 'Wiredeb' package.
- All files are rendered using view HTML engine.
- Fully documented.


###### Instalation
* You need to **install mongoDB** before running this application. Instructions to install on your OS here:
  https://docs.mongodb.com/manual/installation/
  make sure you assing mongod to global path, or run it from the /bin folder, and assing new database path.
* If you have problems with Sass run **$/ npm run fix** to rebuild
* npm install will install all node_modules and bower_components.

```
#!python

$/ npm install
```

***
###### Start the App
* Once you run it and have installed the and configured your mongod, it will automaticly run the process for you, 
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

***
##### Stack/Setup
* Angular 1.6/component, BootStrap alpha.6/Flexbox, Sass, Typescript, nodejs/Express, Lodash, MongoDB/mongoose
  Multer, npm/gulp, nodemon/ browserSync as proxy, dynamic injection and sass globals configuration with Wiredeb.
  tslint, server RESTful API, data retreival
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
* Video clip orientation included.
* npm CLI complains about some undefind methonds, its due to not compiling in ES6 - so ignore it! 
***

###### TODOS ?
* No persistane cache included as yet, only DATA retreival.
* User authentication not yet intergated 

***

##### Thank you