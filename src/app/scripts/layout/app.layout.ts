module app.layout {
  'use strict';

  export class LayoutController {
    static $inject: Array<string> = ['$scope'];
    public category:any;
    constructor(public scope:any) {

      /**
       *  The hierarchy of this app is:
       *  Layout  <<< mockData
       *     > main  <<< mockData
       *        > modal <<< data from parent
       *          > send form  <<< data from parent
       *             >> form is send if the nodemailer is running.
       */


    }   

  }
  angular
    .module('app.layout', []);

  angular
    .module('app.layout')
    .controller('layoutController', LayoutController);
}
