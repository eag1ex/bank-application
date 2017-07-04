module app.terms {
  'use strict';
  export class MainController {
    public terms;
    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      private $document: any,
      private $timeout: any,
      private $q: any,
      private $state: any,
      private dataservice
    ) {
      // dummy toke id:'sdfsdf345sw'  
    }

    gotoTest(state = 'welcome') {
      this.$state.go(state);
    }

    acceptTerms(v) {

    this.dataservice.GLOBALS.terms = v;

      this.$timeout(() => {
        this.$state.go('application');
      }, 1500)
    }
  }


  class MainComponent {

    constructor() { }
    restrict = 'E';
    controllerAs = "vm";
    templateUrl = 'dist/js/app.terms.html';
    controller = MainController;
  }

  angular
    .module('app.terms', []);

  angular
    .module('app.terms').component('terms', new MainComponent());
}
