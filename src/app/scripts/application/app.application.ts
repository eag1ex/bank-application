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
    public finalSave:any;

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
       * we extend our APPFORM model dynamicly, and obj's are rendered on form ng-init
       */
      let form= new Form(this.dataservice, this,this.APPFORM);
      form.model().then((data)=>{
        this.APPFORM = data;
      },(err)=>{
      //  console.info(err);
      })

      this.fileNames = {
        utilityFile: '',
        securityFile: ''
      }
      this.sectionSaved=false;
      this.finalSave = false

      /**
       * sending accross from directive,
       * update display text of uploaded file
       */
      this.$scope.$on('uploadedFile', (event, data) => {
        if (data.name && data.file !== '') {
          this.fileNames[data.name] = data.file;
        }
      })
    };


    /**
     * once file is selected it is uploaded, and we check and validate last form step here
     * to allow final ng-submit/ disabled to false.
     */
    
    uploadFile(vm, step, fieldName) {
      if (!vm || !step || !fieldName) return;
      
      if(typeof this.APPFORM[step][fieldName]==='string'){
        return;
      }

      this.fileupload.upload(vm).then((data) => {
        if (data===false){
          let uploadedFileName = '';
          this.fileNames[fieldName] = 'Allow only image, jpeg/png'; //hide description when we have file from server
          return;
        }
        if (!data.filename) return;

        let uploadedFileName = data.filename;
        this.fileNames[fieldName] = ''; //hide description when we have file from server
        this.APPFORM[step][fieldName] = uploadedFileName;

        // validate last step
        this.checkFormStepsValid(step);
      }, (err) => {
        console.log(err)
      });
    }

    /**
     * redirect to complete/:decision page, uppon form succession.
     */
    
    completeRedirectTo(decission) {
      let goTo = '';
      if (decission == true) goTo = 'approved';
      else goTo = 'declined';

      this.$timeout(() => {
        
         //this.$state.go('complete',{goTo:goTo});
          this.$location.path(`app/application/${goTo}`);
      }, 2000);
    };

    /**
     * on every subsequent / onSave we first perform new  object iterration to send to DB.
     * we aldo update GLOBALS to display on complete page
     */

    dataToSave() {
      // cleanup and save
      let terms = this.dataservice.GLOBALS.terms;
      let token = this.dataservice.GLOBALS.token;
      //update globals
      let approved = this.APPFORM.approved;
      let accountNumber = (approved) ? this.APPFORM.accountNumber : '';
      let contactBranchNumber = (!approved) ? this.APPFORM.contactBranchNumber : '';


      this.dataservice.GLOBALS.approved = approved;
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
      console.info('dataToSave() iterrating now object to send to DB', dataToSave );
      return dataToSave;
    }

    finalValidStep(step) {
      return (this.APPFORM[step].valid && this.$scope.appForm.$valid && step == 'final');
    }

    /**
     * We send information of every step/valid and completed to the db.
     * uppon finalValidStep() true, we redirect to complete page.
     * Server will return accountNumber and contactBranchNumber info on final POST success.
     * 
     * onSave is executed from ng-submit on the final step, approve or decline
     */

    onSave(step = null) {

      if (step !== null) {
        if (this.finalValidStep(step) === false) {
          return;
        }
      }

      let dataToSave = this.dataToSave();
      this.sectionSaved = false
      this.finalSave = false;
      this.dataservice.onSave(dataToSave).then((data) => {
        if (!data) return;
        this.sectionSaved = true;
        if (step !== null) {
          this.finalSave = true;
          this.completeRedirectTo(data.form.approved);
        }
        
        console.info('onSave(), data saved', data);

      }, (err) => {
        console.info(err);
      });

    }

    /**
     * This function handles the received validation of each step, and transition to the next.
     * On final step we do not execute onSave() here. 
     */

    initFormSteps(data) {

      if (data.resolution) {
        this.collapse(data.next, 'show');
        console.info('initFormSteps(), form step valid')
        // callback, for onSave
        if (data.onSave !== null && data.step !== 'final') data.onSave();
      }

      if (!data.resolution) {
        this.collapse(data.next, 'hide');
        console.info('initFormSteps(), invalid form elements', data.invals);
      }

    }

    filesUploadedAre() {
      return (this.fileNames.securityFile && this.fileNames.utilityFile);
    }

    /**
     *  validation each step here, at this pont the APPFORM model has all the keys.
     *  the $scope.appForm (form oject) has the same property keys as our APPFORM model,
     *  so we match each step that gets executed and then validate it.
     *  If keys of each input are returned as valid, then the step is valid.
     */

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

          checkIndex.push(elements[key].$valid);

          if (elements[key].$invalid === true) {
            invalidElms[key] = elements[key];
            formValid = false;
          }

          //bypass for final step, manual validation for upload fields
          if (step == 'final' && this.filesUploadedAre() === true) {
            formValid = true;
          } else if (step == 'final' && this.filesUploadedAre() === false) {
            formValid = false;
          }
        }//if
      }//for

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
        };

        this.initFormSteps(data);
        // show all valid field UI with the help of 'uivalidation' directive.    
        this.manualExecuteValidation(this.APPFORM[step].className);
      }//if

      if (!formValid) {

        this.APPFORM[step].valid = false;
        let data = {
          "step": step, resolution: false,
          invals: invalidElms,
          next: this.APPFORM.nextClass(step),
          onSave: null
        };

        this.initFormSteps(data);
        this.manualExecuteValidation(this.APPFORM[step].className);
      }

    }

    /**
     * JQ jezz
     * manually invoke the onchange event from uivalidation
     */
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
        console.info('manualExecuteValidation', 'no selector');
        return;
      }
    }

    /**
     * collapse plugin part of bootstrap 4 alpha framework.
     */
    public collapse(id, decission) {
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
