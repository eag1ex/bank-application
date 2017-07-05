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
    public sectionSaved:any;
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
      private Form:any,
      private dataservice,
      private $state,
      private fileupload,
      private $location
    ) {
      /**
       * we need to extend our APPFORM model
       */
      let form= new Form(this.dataservice, this,this.APPFORM);
      form.model().then((data)=>{
        this.APPFORM = data;
      })

      this.fileNames = {
        utilityFile: '',
        securityFile: ''
      }
      this.sectionSaved=false

      this.$scope.$on('uploadedFile', (event, data) => {
        console.log('uploadedFile', data)
        if (data.name && data.file !== '') {
          this.fileNames[data.name] = data.file;
        }
      })
    };

    completeRedirectTo(decission) {
      let goTo = '';
      if (decission == true) goTo = 'approved';
      else goTo = 'declined';

      this.$timeout(() => {
        this.$location.path(`app/application/${goTo}`);
      }, 2000);
    }

    uploadFile(vm, step, fieldName) {
      this.fileupload.upload(vm).then((data) => {
        if (!data.filename) return;

        let uploadedFileName = data.filename;
        this.fileNames[fieldName] = ''; //hide description when we have file from server
        this.APPFORM[step][fieldName] = uploadedFileName;

        // validate last step
        this.checkFormStepsValid(step);

        console.log('this.APPFORM[step][fieldName]', this.APPFORM[step][fieldName])
      }, (err) => {
        console.log('error getting file name', err)
      });
    }


    dataToSave() {
      // cleanup and save
      let terms = this.dataservice.GLOBALS.terms;
      let token = this.dataservice.GLOBALS.token;
      //update globals
      let approved = this.APPFORM.approved;
      let accountNumber = (approved) ? this.APPFORM.accountNumber : '';
      let contactBranchNumber = (!approved) ? this.APPFORM.contactBranchNumber : '';

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

      console.log('mergedForm', mergedForm)
      let dataToSave = Object.assign({}, { form: mergedForm }, { token: token });
      console.log('dataToSave', dataToSave)
      return dataToSave;
    }

    finalValidStep(step) {
      return (this.APPFORM[step].valid && this.$scope.appForm.$valid && step == 'final');
    }

    onSave(step = null) {

      if (step !== null) {
        console.log('stuck?? step',step)
        console.log('finalValidStep? ',this.finalValidStep(step))
        if (this.finalValidStep(step) === false) {
          console.log('final step invalid!')
          return;
        }
      }
      console.log('dataToSave ', this.dataToSave());
      let dataToSave = this.dataToSave();

      this.sectionSaved = false

      // return;
      this.dataservice.onSave(dataToSave).then((data) => {
        if (!data) return;
        this.sectionSaved = true;
        console.log('was data saved', data);
        if (step !== null) this.completeRedirectTo(data.form.approved);

      }, (err) => {
        console.log('err', err)
      });

    }

    initFormSteps(data) {

      if (data.resolution) {
        this.collapse(data.next, 'show');
        console.log(data, 'form stage valid');
        // we execute onSave('final') via ng-submit
        if (data.onSave !== null && data.step !== 'final') data.onSave();// callback, for onSave

        console.log(this.APPFORM[data.step])
      }

      if (!data.resolution) {
        this.collapse(data.next, 'hide');
        console.log(data, 'form stage not valid');
        console.log('invalid elms', data.invals)
      }

    }

    filesUploadedAre() {
      return (this.fileNames.securityFile && this.fileNames.utilityFile);
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

          //bypass for final step, manual validation for upload fields
          if (step == 'final' && this.filesUploadedAre() === true) {
            formValid = true;
          } else if (step == 'final' && this.filesUploadedAre() === false) {
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

        let notFinalsave = (step !== 'final');

        let data = {
          step: step,
          resolution: true,
          next: this.APPFORM.nextClass(step),
          onSave: () => {
            return (notFinalsave === true) ? this.onSave() : false;
          }
        }

        this.initFormSteps(data);
        // show all valid fields     
        this.manualExecuteValidation(this.APPFORM[step].className);
        console.log('next step is?? ' + step)
        console.log('this.APPFORM.nextClass(step)', this.APPFORM.nextClass(step))
      }
      if (!formValid) {
        this.APPFORM[step].valid = false;

        let data = {
          "step": step, resolution: false,
          invals: invalidElms,
          next: this.APPFORM.nextClass(step),
          onSave: null
        };

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
