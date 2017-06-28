module app.welcome {
  'use strict';
  export class MainController {
    public register;
    static $inject: Array<string> = ['$scope', '$element', '$document', '$timeout', '$q', 'dataservice'];
    /* @ngInject */
    constructor(
      public scope: any,
      public element: any,
      public document: any,
      public timeout: any,
      public q: any,
      private DataService
    ) {

      this.register='testval'
      //our data!  
      DataService.get().then((data) => {

      }, (error) => {
        console.log('data not available', error)
      })
    }

  }

  class MainComponent {

    constructor() { } 
    restrict = 'E';
    controllerAs = "vm";
    templateUrl = 'dist/js/app.welcome.html';  
    controller = MainController;
  }

angular
    .module('app.welcome',[]); 

  angular
    .module('app.welcome').component('welcome', new MainComponent());
}
