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
    ) {
      // dummy toke id:'sdfsdf345sw'  

      this.formOnsubmit=false;

      this.registerNewUser={
        token:'',
        valid:''
      }

      
    }

    public registerUser(){
      this.formOnsubmit=true;
      let token = this.registerNewUser.token;
      this.dataservice.registerUser(token).then((data)=>{
        //redirect to application page and caching data
        if (data.user_exists===true){
          this.registerNewUser.valid =false;
          this.existingUser = true;
        }else{
          this.existingUser = false;
          this.registerNewUser.valid = true;
        }
      }).catch((err)=>{
        this.registerNewUser.valid=false;
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
    .module('app.welcome',[]); 

  angular
    .module('app.welcome').component('welcome', new MainComponent());
}
