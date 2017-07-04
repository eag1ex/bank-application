module app.application {
  'use strict';
  export class MainController {

    /**
     * 
     * The APPFORM models are dynamicly created on the html template with ng-init,
     * when equired we merge it with appFormClass.
     * 
     * The form name values use {common name space} for ease of use for example:
     * ngInit/ngModel=vm.APPFORM.one.homePhone  == name=homePhone
     * ngInit/ngModel=vm.APPFORM.one.homePhonePre == homePhonePre
     * 
     * First we extend our APPFORM with appFormClass then we wait for new data if available,
     * for existing user we merge the object with new data.
     * We check for validation of each steps using checkFormStepsValid()
     * which tne calls initFormSteps() to make decision of the next form STEP.
     * 
     * FUNCTION manualExecuteValidation() forces the uivalidation directive to reinitialize the ui.
     * 
     */

    public APPFORM: any = {};
    public application: Object;
    public newAppForm: any;
    public fileNames: any;
    public dummy: any;

    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      public $document: any,
      public $timeout: any,
      public $q: any,
      private dataservice,
      private $state,
      private fileupload,
      private $location
    ) {
      this.dummy = {
        tok: 'sdfsdf345sw'
      };


      /**
       * 
       * we need to extend our APPFORM with appFormClass
       */
      let _t = this;
      let appFormClass = function (val = 'one') {

        this.one = { /*index: 9,*/ valid: false };
        this.two = { /*index: 4,*/ valid: false };
        this.three = { /*index: 3,*/ valid: false };
        this.final = { /*index: 1,*/ valid: false };

        this.update = (d = _t.APPFORM) => {
          let data = {
            one: Object.assign({}, d.one, { className: ".step-one" }),
            two: Object.assign({}, d.two, { className: ".step-two" }),
            three: Object.assign({}, d.three, { className: ".step-three" }),
            final: Object.assign({}, d.final, { className: ".step-final" })
          }
          return data;
        }

        this.data = this.update;

        this.nextClass = (v = val) => {
          var next = 0;
          var data = this.data();
          for (var key in data) {
            if (next === 1) return data[key].className;
            if (key === v) next++;
          }
        }
      };

      //initially anyway
      this.APPFORM = _.merge(this.APPFORM, new appFormClass());

      // at this point we retreive cached data
      this.dataservice.getCached().then((data) => {
        // console.log('got cached data! ',data)
        if (data.form !== undefined && Object.keys(data.form).length > 0) {
          this.APPFORM = _.merge(this.APPFORM, data.form);
          console.log('we have data with form', this.APPFORM);
        }
        return this.APPFORM;
      }, (err) => {
        console.log('no APPFORM', err)
      });

      //for reference
      this.fileNames = {
        utilityFile: '',
        securityFile: ''
      }

      this.$scope.$on('uploadedFile', (event, data) => {
        console.log('uploadedFile', data)
        if (data.name && data.file !== '') {
          this.fileNames[data.name] = data.file;
        }
      })
    };

    completeRedirectTo(decission) {
      let goTo='';
      if (decission==true) goTo ='approved';
      else goTo ='declined';

      this.$timeout(() => {
        this.$location.path(`app/application/${goTo}`);
      }, 1500);
    }

    uploadFile(vm, step, fieldName) {
      this.fileupload.upload(vm).then((data) => {
        if (!data.filename) return;

        let uploadedFileName = data.filename;
        this.fileNames[fieldName] = ''; //hide description when we have file from server
        this.APPFORM[step][fieldName] = uploadedFileName;

        console.log('this.APPFORM[step][fieldName]', this.APPFORM[step][fieldName])
      }, (err) => {
        console.log('error getting file name', err)
      });
    }

    dataToSave() {
      // cleanup and save
      let terms = this.dataservice.GLOB().terms;
      let token = this.dataservice.GLOB().token;
      //update globals
      let approved = this.APPFORM.approved;
      let accountNumber = this.APPFORM.accountNumber;
      let contactBranchNumber = this.APPFORM.contactBranchNumber;

      this.dataservice.GLOBALS.approved = this.APPFORM.approved;
      this.dataservice.GLOBALS.accountNumber = accountNumber;
      this.dataservice.GLOBALS.contactBranchNumber = contactBranchNumber;

      let updateVars = {
        tc: terms,
        approved: approved,
        accountNumber: accountNumber,
        contactBranchNumber: contactBranchNumber
      };

      let mergedForm = _.merge(this.APPFORM.data(), updateVars)
      let dataToSave = Object.assign({}, { form: mergedForm }, { token: token });

      return dataToSave;
    }

    onSave() {
      let dataToSave = this.dataToSave();

      //if (this.$scope.appForm.$invalid) return;

      console.log('dataToSave ', dataToSave);

      // return;
      this.dataservice.onSave(dataToSave).then((data) => {
        if (!data) return;

        console.log('was data saved', data);
        this.completeRedirectTo(data.form.approved);

      }, (err) => {
        console.log('err', err)
      });

    }

    initFormSteps(data) {

      if (data.resolution) {
        this.collapse(data.next, 'show');
        console.log(data, 'form stage valid');
        console.log(this.APPFORM[data.step])
      }

      if (!data.resolution) {
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
        }//IF
      }//FOR

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
        console.log('next step is?? ' + step)
        console.log('this.APPFORM.nextClass(step)', this.APPFORM.nextClass(step))
      }
      if (!formValid) {
        this.APPFORM[step].valid = false;

        let data = { "step": step, resolution: false, invals: invalidElms, next: this.APPFORM.nextClass(step) };
        this.initFormSteps(data);
        // show all invalid fields        
        this.manualExecuteValidation(this.APPFORM[step].className);
        console.log('this.APPFORM.nextClass()', step, this.APPFORM.nextClass(step))
      }

    }//  

    manualExecuteValidation(el) {

      /**
       * ==DOTOS
       * STILL MISSING THE 'SELECT' LOGIC
       */
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
