module app.welcome {
  'use strict';
  export class MainController {
    public registerNewUser:any;
    public existingUser;
    public formOnsubmit:boolean;
    public clickToContinue:boolean;
    public welcomeUser:any;

/**
 * app.welcome script registers new or existing token, call gets made to dataservice.registerUser
 * and if user is new then it will register or prompt that it exists and will redirect to terms page.
 * after post request is made, the data then gets cashed to the subsequent page, unless you refress the page,
 * no persistante cache have been integrated at this stage only RESTFUL api.
 */


    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      private $document: any,
      private $timeout: any,
      private $q: any,
      private dataservice:any,
      private $state: any
    ) {

      this.formOnsubmit = false;
      this.registerNewUser = {
        valid: '',
        invalid:''
      }
    }

    redirectingToNext(state = 'welcome') {
      this.$timeout(() => {
        this.$state.go(state);
      }, 2500)
    }

    public registerUser() {
      if (this.$scope.welcomeForm.$invalid) return;

      if(this.registerNewUser.valid){
        this.redirectingToNext('terms');
        return;
      }

      // in case we do subsequent submit events;
      this.dataservice.resetExisting();

      this.formOnsubmit = true;
      let token = this.registerNewUser.token;
      
      this.dataservice.registerUser(token).then((data) => {

        let newData = data;
        this.existingUser = false;
        this.registerNewUser.invalid = false;

        if(newData.invalidToken){
          this.registerNewUser.valid = '';
          this.existingUser = false;
          this.registerNewUser.invalid = true;
        }

        if (newData.userExists === true) {
          console.log('newData exists',newData)
          // data is already cached at this point           
          this.registerNewUser.valid = false;
          this.existingUser = true;
          // got to next page
          if(newData.data.form!==undefined){
            this.welcomeUser = newData.data.form.one.firstName;
           this.dataservice.GLOBALS.terms=newData.data.form.tc;
          }

          this.clickToContinue =true;
          this.redirectingToNext('terms');

        } if (newData.userExists === false) {
          // data is already cached at this point   
          this.existingUser = false;
          this.registerNewUser.valid = true;
          // got to next page
        }
      },(err)=>{
        return err;
      }).catch((err) => {
        this.registerNewUser.valid = false;
        console.log('server error ',err)
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
