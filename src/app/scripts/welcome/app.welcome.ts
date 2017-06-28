module app.welcome {
  'use strict';
  export class MainController {
    public register;
    static $inject: Array<string> = ['$scope', '$element', '$document', '$timeout', '$q'];
    /* @ngInject */   
    constructor(
      public scope: any,
      public element: any,
      public document: any,
      public timeout: any,
      public q: any,  
 
    ) {
      alert('no')
      this.register='testval';
    
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
