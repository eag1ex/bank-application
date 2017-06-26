#### - Bank Application -
TBA

######Repo


###### Instalation

* Run **$/ npm run hot** to install node-sass, and rebuild it. (you might need sudo if on Mac/Linux)
* Unit testing **$/ npm run itest** to install first

```
#!python

$/ npm install
```

***
###### Start the App

```
#!python

$/ npm run nodemailer   
$/ npm start
$/ npm run test
```

***
##### Stack/Setup
* Angular 1.6/component, BootStrap alpha.6/Flexbox, Sass/Compass, Typescript, nodejs/Express, Lodash
* Following John Papa Angular Styleguide
* Integraded in modular fashion
* Coded in OOP
***


##### File structure

> **app**

>> scripts

>>> directives

>>>> email.form.ts

>>>> project.name.ts

>>> main

>>>> app.main.ts

>>>> app.main.html

>>>> app.ticket.modal.ts

>>>> app.ticket.modal.html

>>>> app.dashboard.ts

>>> services

>>>> mock.data.ts

>>> fake.data.server

>>>> dataservice.ts

>>>> httpbackedMockService.ts

>>> layout

>>>> app.layout.ts

>>>> layout.html

>> **app.core.ts**

>> **app.ts**

>> scss

>>> _preloader.scss

>>> cog09.svg

>>> global.variables.scss

>>> layout.scss

>>> main.scss

>> tests

>>> ...

> index.html

```
#!python

     /**
       *  The hierarchy of this app is:
       *  Layout  <<< $httbackend mock service
       *     > main  <<< $httbackend mock service
       *        > modal <<< data from parent
       *          > send form  <<< data from parent
       *             >> form is send if nodemailer is running.
       */
```

***

##### -- Remarks --
* Tested and works on Linux and Windows
* Bower files are installed in ./public dir, and used by "wiredep"
***

###### To be completed ?
* TBA

***

##### Thank you