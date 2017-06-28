module app.application {
  'use strict';
  export class MainController {
    public formdata: any;
    public steps: any;
    public APPFORM: any;
    public application: Object;
    public numberOnlyReg: any;
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

      this.numberOnlyReg = "/^[1-9][0-9]{0,2}(?:,?[0-9]{3}){0,3}(?:\.[0-9]{1,2})?$/";
      this.steps = {
        one: false, two: false, three: false, final: false
      }

      this.APPFORM = {
        one: { index: 9, valid: false },
        two: { index: 4, valid: false },
        three: { index: 3, valid: false },
        last: { index: 1, valid: false }
      }

      for (var key in this.APPFORM) {
        Object.defineProperty(this.APPFORM[key], 'deferred', {
          value: this.q.defer()
        });

      }

      this.scope.$on('formStep', (event, data) => {
        if (data.step === 'one' && data.resolution) {
          this.collapse(data.nextID,'show');
          console.log(data.step, 'form stage valid');
          console.log(this.APPFORM[data.step])
        }
        else {
           this.collapse(data.nextID,'hide');
          console.log(data.step, 'form stage not valid');
          console.log(this.APPFORM[data.step])
          console.log('invalid elms', data.invals)

        }
      });

      /*
      this.APPFORM[step].deferred(true)
      this.APPFORM.one.deferred.then(()=>{
        console.log('form validated')
      },()=>{
        console.log('errors on the form')
      })
      */    


      //our data!  
      DataService.get().then((data) => {
        //  this.user = data.user;
        // this.lists = data.lists;
      }, (error) => {
        console.log('data not available', error)
      })
    }

    checkFromStepsValid(step, nextID) {
      if (!step) return false;

      var index = 0;
      var elements = this.scope.appForm;
      var formValid = false;
      var invalidElms = {}
      for (var key in elements) {

        if (key in this.APPFORM[step] && elements.hasOwnProperty(key)) {
          index++;
          formValid = false;
          if (elements[key].$valid === true) {
            formValid = true;
          }
          if (elements[key].$invalid === true) {
            invalidElms[key] = elements[key];
            formValid = false;
          }

        }
      }

      // checking if the form length match with the vm models are correct

      if (formValid) {
        this.APPFORM[step].valid = true;
        this.scope.$emit('formStep', { "step": step, resolution: true, next: nextID });

      }
      if (!formValid) {
        this.APPFORM[step].valid = false;
        this.scope.$emit('formStep', { "step": step, resolution: false, invals: invalidElms, next: nextID });
      }

    }//


    public collapse(id, decission) {
      var action = (decission) ? 'show' : 'hide';
      $(id).collapse(action);
    }


  }

  class MainComponent {

    constructor() { }
    restrict = 'E';
    controllerAs = 'vm';
    templateUrl = 'dist/js/app.application.html';
    controller = MainController;
  }

  angular
    .module('app.application', []);

  angular
    .module('app.application').component('application', new MainComponent());
}
