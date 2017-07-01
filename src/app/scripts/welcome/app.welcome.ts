module app.welcome {
  'use strict';
  export class MainController {
    public registerNewUser;
    public existingUser;
    public formOnsubmit;
    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      private $document: any,
      private $timeout: any,
      private $q: any,
      private dataservice
      private $state: any
    ) {
      // dummy toke id:'sdfsdf345sw'  

      this.formOnsubmit = false;

      this.registerNewUser = {
        token: '',
        valid: ''
      }
    }

    gotoTest(state = 'welcome'){
      this.$state.go(state);
    }

    redirectingToNext(state = 'welcome') {
      this.$timeout(() => {
        this.$state.go(state);
      }, 2000)
    }

    public registerUser() {
      if (this.$scope.welcomeForm.$invalid) return;

      // in case we do subsequent submit events;
      this.dataservice.resetExisting();

      this.formOnsubmit = true;
      let token = this.registerNewUser.token;

      this.dataservice.registerUser(token).then((data) => {
        let newData = data;
        this.existingUser = false;



        if (newData.userExists === true) {
          // data is already cached at this point           
          this.registerNewUser.valid = false;
          this.existingUser = true;
          console.log('newData userExists', newData);
          // got to next page
          this.redirectingToNext('terms');

        } if (newData.userExists === false) {
          // data is already cached at this point   
          this.existingUser = false;
          this.registerNewUser.valid = true;

          // got to next page
          this.redirectingToNext('terms');
        }

      }).catch((err) => {
        this.registerNewUser.valid = false;
        console.log(err)
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
    .module('app.welcome', []);

  angular
    .module('app.welcome').component('welcome', new MainComponent());
}
