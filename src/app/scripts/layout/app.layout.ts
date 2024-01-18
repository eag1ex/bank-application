module app.layout {
  'use strict';

  export class LayoutController {

    public appNumber: any;
    /* @ngInject */
    constructor(public $rootScope: any, public dataservice: any, private $timeout: any, public $scope: any) {

      $rootScope.$on('onDataChange', (e, data) => {
        $timeout(() => {
          this.appNumber = dataservice.GLOBALS.token;
        }, 100);
      });
    }
  }
  angular
    .module('app.layout', []);

  angular
    .module('app.layout')
    .controller('layoutController', LayoutController);
}
