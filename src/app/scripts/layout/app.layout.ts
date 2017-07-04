module app.layout {
  'use strict';

  export class LayoutController {

    public appNumber: any;
    /* @ngInject */
    constructor(public $rootScope: any, public dataservice: any, private $timeout:any, public $scope:any) {

      /**
       *  The hierarchy of this app is:
       *  Layout  <<< mockData
       *     > main  <<< mockData
       *        > modal <<< data from parent
       *          > send form  <<< data from parent
       *             >> form is send if the nodemailer is running.
       */

        
       $rootScope.$on('onDataChange',(e,data)=> {
          $timeout(()=>{
            this.appNumber = dataservice.GLOB().token
          },100)           
       })

    }

  }
  angular
    .module('app.layout', []);

  angular
    .module('app.layout')
    .controller('layoutController', LayoutController);
}
