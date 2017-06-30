module app.application {
  'use strict';
  export class MainController {

    public APPFORM: any;
    public application: Object;
    public newAppForm: any;

    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      public $document: any,
      public $timeout: any,
      public $q: any
    ) {


      /**
       * 
       * we need to extend our APPFORM with appFormClass
       */

      let appFormClass = function (val = 'one') {
        this.one = { index: 9, valid: false, className: ".step-one" };
        this.two = { index: 4, valid: false, className: ".step-two" };
        this.three = { index: 3, valid: false, className: ".step-three" };
        this.final = { index: 1, valid: false, className: ".step-final" };

        this.data = Object.assign({}, { one: this.one }, { two: this.two }, { three: this.three }, { final: this.final });

        this.nextClass = (v=val) => {
          var next = 0;
          for (var key in this.data) {
            if (next ===1) return this.data[key].className;
            if (key === v)  next++;          
          }
        }
      }
      this.APPFORM = {};
      Object.assign(this.APPFORM, new appFormClass());
      console.log('this.APPFORM', this.APPFORM)

      /*
      for (var key in this.APPFORM) {
        Object.defineProperty(this.APPFORM[key], 'deferred', {
          value: this.$q.defer()
        });

      }
      */

      /*
      this.APPFORM[step].deferred(true)
      this.APPFORM.one.deferred.then(()=>{
        console.log('form validated')
      },()=>{
        console.log('errors on the form')
      })
      */
    }

    initFormSteps(data) {

      if (data.resolution) {
        this.collapse(data.next, 'show');
        console.log(data, 'form stage valid');
        console.log(this.APPFORM[data.step])
      }
      
      if (!data.resolution){
          this.collapse(data.next, 'hide');
          console.log(data, 'form stage not valid');
          console.log('invalid elms', data.invals)
      }
     
    }

    checkFormStepsValid(step) {
      if (!step) return false;

      var index = 0;
      var elements = this.$scope.appForm;
      var formValid = false;
      var isDirty = false;
      var checkIndex = [];
      var invalidElms = {}
      for (var key in elements) {

        //only loop thru matching step
        if (key in this.APPFORM[step] && elements.hasOwnProperty(key)) {
          index++;
          formValid = false;

          //  elements[key].$setPristine()
          checkIndex.push(elements[key].$valid);

          if (elements[key].$invalid === true) {
            console.log('invals', elements[key])
            invalidElms[key] = elements[key];
            formValid = false;
          }

        }
      }

      for (let i = 0; i < checkIndex.length; i++) {
        if (checkIndex[i] === false) {
          formValid = false;
          break;
        }
        else formValid = true;
      }


      if (formValid) {
        this.APPFORM[step].valid = true;

        //revalidate fields
        $(this.APPFORM[step].className).find('.input-group').mouseup();
        let data = { step: step, resolution: true, next: this.APPFORM.nextClass(step) }
        this.initFormSteps(data);
        // show all valid fields   
        this.manualExecuteValidation(this.APPFORM[step].className);

      }
      if (!formValid) {
        this.APPFORM[step].valid = false;
        let data = { "step": step, resolution: false, invals: invalidElms, next: this.APPFORM.nextClass(step) };
        this.initFormSteps(data);
        // show all invalid fields        
        this.manualExecuteValidation(this.APPFORM[step].className);

        console.log('this.APPFORM.nextClass()',step, this.APPFORM.nextClass(step))

      }

    }//

    manualExecuteValidation(el) {
      var elm;
      if ($(el).has('input').length > 0) {
        elm = $(el).find('.input-group>input');
        elm.change((el) => {
          var orgVal = $(el.target).val();
          $(el.target).val(orgVal);
        }).change().off('change')
      }
      else {
        console.log('manualExecuteValidation', 'no selector');
        return;
      }
    }

    public collapse(id, decission) {
      console.log('fire colapse', id, decission)
      var action = (decission === 'show') ? 'show' : 'hide';
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
