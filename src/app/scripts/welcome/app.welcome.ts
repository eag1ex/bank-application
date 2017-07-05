module app.welcome {
  'use strict';
  export class MainController {
    public registerNewUser:any;
    public existingUser;
    public formOnsubmit:boolean;
    public clickToContinue:boolean;
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
      // dummy toke id:'sdfsdf345sw'  

      this.formOnsubmit = false;

      this.registerNewUser = {
        token: '',
        valid: '',
        invalid:''
      }
    }

    gotoTest(state = 'welcome'){
      this.$state.go(state);
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
        console.log('what is the data',data)
       // if 

        let newData = data;
        this.existingUser = false;
        this.registerNewUser.invalid = false;

        if(newData.invalidToken){
          this.registerNewUser.valid = '';
          this.existingUser = false;
          this.registerNewUser.invalid = true;
        }

        if (newData.userExists === true) {
          // data is already cached at this point           
          this.registerNewUser.valid = false;
          this.existingUser = true;
          console.log('newData userExists', newData);
          // got to next page
          if(newData.data.form!==undefined){
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
        console.log('before chatch')
        return err;
      }).catch((err) => {
        this.registerNewUser.valid = false;
        console.log('what is the error?',err)
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
