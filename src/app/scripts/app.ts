//avoid compailer error messages
declare var angular: any;
declare var _: any;
module app {
  'use strict';
  angular.module('app', [
    // dependant
    'ui.router',
    'ngAnimate',
    'ngMockE2E',
    'dndLists',

    'app.mockData',
    'app.data.dataservice',
    'app.data.httpMock',
    'app.core',
    'app.layout',

    'app.welcome',
    'app.application',
    'app.applicationForm',
    'app.appNumber'
  ]);
}