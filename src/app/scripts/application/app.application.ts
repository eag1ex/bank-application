module app.application {
  'use strict';
  export class MainController {
    public formdata:any;
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
      
       this.formdata = {
         name:'data from application'
       };

      //our data!  
      DataService.get().then((data) => {
        //  this.user = data.user;
       // this.lists = data.lists;
      }, (error) => {
        console.log('data not available', error)
      })
    }

  }

  class MainComponent {

    constructor() { }
    restrict = 'E';
    controllerAs = "vm";
    templateUrl = 'dist/js/app.application.html';
    controller = MainController;
  }

angular
    .module('app.application',[]);
 
  angular
    .module('app.application').component('application', new MainComponent());
}
