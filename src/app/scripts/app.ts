//avoid compailer error messages   
declare var angular: any;
declare var _: any;
declare var $: any;
module app {
  'use strict';
  angular.module('app', [
    // dependant
    'ui.router',
    'ngAnimate',  
    
    //'ngMockE2E', couses template not loading
    //'dndLists',

   // 'app.mockData',
   'app.dataservice',
   // 'app.data.httpMock',
    'app.core',
    'app.layout',

    'app.welcome',
    'app.application',
  //  'app.applicationForm',
    'app.validateNumber',
    'app.appNumber',
    'app.myvalidation'
  ]);
}  