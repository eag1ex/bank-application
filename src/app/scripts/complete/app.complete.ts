module app.complete {
  'use strict';
  export class MainController {
    public decission;
    public application: any;
    /* @ngInject */
    constructor(
      private $timeout: any,
      private $state: any,
      private dataservice,
      private $stateParams
    ) {

      this.application = {
        decission :$stateParams.decission,
        accountNumber: dataservice.GLOBALS.accountNumber,
        contactBranchNumber: dataservice.GLOBALS.contactBranchNumber,
        appNumber: dataservice.GLOBALS.token
      }
    }

  }

  class MainComponent {

    constructor() { }
    restrict = 'E';
    controllerAs = "vm";
    templateUrl = 'dist/js/app.complete.html';
    controller = MainController;
  }

  angular
    .module('app.complete', []);

  angular
    .module('app.complete').component('complete', new MainComponent());
}
