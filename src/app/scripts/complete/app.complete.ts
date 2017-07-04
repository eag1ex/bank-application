module app.complete {
  'use strict';
  export class MainController {
    public decission;
    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      private $document: any,
      private $timeout: any,
      private $q: any,
      private $state: any,
      private dataservice,
      private $stateParams
    ) {
      this.decission = $stateParams.decission;

    }

    gotoTest(state = 'welcome') {
      this.$state.go(state);
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
