var app;
(function (app) {
    var application;
    (function (application) {
        'use strict';
        var MainController = /** @class */ (function () {
            /* @ngInject */
            MainController.$inject = ["$scope", "$element", "$document", "$timeout", "$q", "Form", "dataservice", "$state", "fileupload", "$location"];
            function MainController($scope, $element, $document, $timeout, $q, Form, dataservice, $state, fileupload, $location) {
                var _this = this;
                this.$scope = $scope;
                this.$element = $element;
                this.$document = $document;
                this.$timeout = $timeout;
                this.$q = $q;
                this.Form = Form;
                this.dataservice = dataservice;
                this.$state = $state;
                this.fileupload = fileupload;
                this.$location = $location;
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
                this.APPFORM = {};
                /**
                 * we extend our APPFORM model dynamicly, and obj's are rendered on form ng-init
                 */
                var form = new Form(this.dataservice, this, this.APPFORM);
                form.model().then(function (data) {
                    _this.APPFORM = data;
                }, function (err) {
                    //  console.info(err);
                });
                this.fileNames = {
                    utilityFile: '',
                    securityFile: ''
                };
                this.sectionSaved = false;
                this.finalSave = false;
                /**
                 * sending accross from directive,
                 * update display text of uploaded file
                 */
                this.$scope.$on('uploadedFile', function (event, data) {
                    if (data.name && data.file !== '') {
                        _this.fileNames[data.name] = data.file;
                    }
                });
            }
            ;
            /**
             * once file is selected it is uploaded, and we check and validate last form step here
             * to allow final ng-submit/ disabled to false.
             */
            MainController.prototype.uploadFile = function (vm, step, fieldName) {
                var _this = this;
                if (!vm || !step || !fieldName)
                    return;
                if (typeof this.APPFORM[step][fieldName] === 'string') {
                    return;
                }
                this.fileupload.upload(vm).then(function (data) {
                    if (data === false) {
                        var uploadedFileName_1 = '';
                        _this.fileNames[fieldName] = 'Allow only image, jpeg/png'; //hide description when we have file from server
                        return;
                    }
                    if (!data.filename)
                        return;
                    var uploadedFileName = data.filename;
                    _this.fileNames[fieldName] = ''; //hide description when we have file from server
                    _this.APPFORM[step][fieldName] = uploadedFileName;
                    // validate last step
                    _this.checkFormStepsValid(step);
                }, function (err) {
                    console.log(err);
                });
            };
            /**
             * redirect to complete/:decision page, uppon form succession.
             */
            MainController.prototype.completeRedirectTo = function (decission) {
                var _this = this;
                var goTo = '';
                if (decission === true)
                    goTo = 'approved';
                else
                    goTo = 'declined';
                this.$timeout(function () {
                    //this.$state.go('complete',{goTo:goTo});
                    _this.$location.path("app/application/" + goTo);
                }, 2000);
            };
            ;
            /**
             * on every subsequent / onSave we first perform new  object iterration to send to DB.
             * we aldo update GLOBALS to display on complete page
             */
            MainController.prototype.dataToSave = function () {
                // cleanup and save
                var terms = this.dataservice.GLOBALS.terms;
                var token = this.dataservice.GLOBALS.token;
                //update globals
                var approved = this.APPFORM.approved;
                var accountNumber = (approved) ? this.APPFORM.accountNumber : '';
                var contactBranchNumber = (!approved) ? this.APPFORM.contactBranchNumber : '';
                this.dataservice.GLOBALS.approved = approved;
                this.dataservice.GLOBALS.accountNumber = accountNumber;
                this.dataservice.GLOBALS.contactBranchNumber = contactBranchNumber;
                var updateVars = {
                    tc: terms,
                    approved: approved,
                    accountNumber: accountNumber,
                    contactBranchNumber: contactBranchNumber
                };
                var mergedForm = _.merge(this.APPFORM.data(), updateVars);
                var dataToSave = Object.assign({}, { form: mergedForm }, { token: token });
                console.info('dataToSave() iterrating now object to send to DB', dataToSave);
                return dataToSave;
            };
            MainController.prototype.finalValidStep = function (step) {
                return (this.APPFORM[step].valid && this.$scope.appForm.$valid && step === 'final');
            };
            /**
             * We send information of every step/valid and completed to the db.
             * uppon finalValidStep() true, we redirect to complete page.
             * Server will return accountNumber and contactBranchNumber info on final POST success.
             *
             * onSave is executed from ng-submit on the final step, approve or decline
             */
            MainController.prototype.onSave = function (step) {
                var _this = this;
                if (step === void 0) { step = null; }
                if (step !== null) {
                    if (this.finalValidStep(step) === false) {
                        return;
                    }
                }
                var dataToSave = this.dataToSave();
                this.sectionSaved = false;
                this.finalSave = false;
                this.dataservice.onSave(dataToSave).then(function (data) {
                    if (!data)
                        return;
                    _this.sectionSaved = true;
                    if (step !== null) {
                        _this.finalSave = true;
                        _this.completeRedirectTo(data.form.approved);
                    }
                    console.info('onSave(), data saved', data);
                }, function (err) {
                    console.info(err);
                });
            };
            /**
             * This function handles the received validation of each step, and transition to the next.
             * On final step we do not execute onSave() here.
             */
            MainController.prototype.initFormSteps = function (data) {
                if (data.resolution) {
                    this.collapse(data.next, 'show');
                    console.info('initFormSteps(), form step valid');
                    // callback, for onSave
                    if (data.onSave !== null && data.step !== 'final')
                        data.onSave();
                }
                if (!data.resolution) {
                    this.collapse(data.next, 'hide');
                    console.info('initFormSteps(), invalid form elements', data.invals);
                }
            };
            MainController.prototype.filesUploadedAre = function () {
                return (this.fileNames.securityFile && this.fileNames.utilityFile);
            };
            /**
             *  validation each step here, at this pont the APPFORM model has all the keys.
             *  the $scope.appForm (form oject) has the same property keys as our APPFORM model,
             *  so we match each step that gets executed and then validate it.
             *  If keys of each input are returned as valid, then the step is valid.
             */
            MainController.prototype.checkFormStepsValid = function (step) {
                var _this = this;
                if (!step)
                    return false;
                var index = 0;
                var elements = this.$scope.appForm;
                var formValid = false;
                var checkIndex = [];
                var invalidElms = {};
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
                        if (step === 'final' && this.filesUploadedAre() === true) {
                            formValid = true;
                        }
                        else if (step === 'final' && this.filesUploadedAre() === false) {
                            formValid = false;
                        }
                    } //if
                } //for
                for (var i = 0; i < checkIndex.length; i++) {
                    if (checkIndex[i] === false) {
                        formValid = false;
                        break;
                    }
                    else
                        formValid = true;
                }
                if (formValid) {
                    this.APPFORM[step].valid = true;
                    var notFinalsave_1 = (step !== 'final');
                    var data_1 = {
                        step: step,
                        resolution: true,
                        next: this.APPFORM.nextClass(step),
                        onSave: function () {
                            return (notFinalsave_1 === true) ? _this.onSave() : false;
                        }
                    };
                    this.initFormSteps(data_1);
                    // show all valid field UI with the help of 'uivalidation' directive.    
                    this.manualExecuteValidation(this.APPFORM[step].className);
                } //if
                if (!formValid) {
                    this.APPFORM[step].valid = false;
                    var data_2 = {
                        "step": step, resolution: false,
                        invals: invalidElms,
                        next: this.APPFORM.nextClass(step),
                        onSave: null
                    };
                    this.initFormSteps(data_2);
                    this.manualExecuteValidation(this.APPFORM[step].className);
                }
            };
            /**
             * JQ jezz
             * manually invoke the onchange event from uivalidation
             */
            MainController.prototype.manualExecuteValidation = function (el) {
                /**
                 * ==DOTOS
                 * STILL MISSING THE 'SELECT' LOGIC
                 */
                var elm;
                if ($(el).has('input').length > 0) {
                    elm = $(el).find('.input-group>input');
                    elm.change(function (el) {
                        var orgVal = $(el.target).val();
                        $(el.target).val(orgVal);
                    }).change().off('change');
                }
                else {
                    console.info('manualExecuteValidation', 'no selector');
                    return;
                }
            };
            /**
             * collapse plugin part of bootstrap 4 alpha framework.
             */
            MainController.prototype.collapse = function (id, decission) {
                var action = (decission === 'show') ? 'show' : 'hide';
                $(id).collapse(action);
            };
            return MainController;
        }());
        application.MainController = MainController;
        var MainComponent = /** @class */ (function () {
            function MainComponent() {
                this.restrict = 'E';
                this.controllerAs = 'vm';
                this.templateUrl = 'dist/js/app.application.html';
                this.controller = MainController;
            }
            return MainComponent;
        }());
        angular
            .module('app.application', []);
        angular
            .module('app.application').component('application', new MainComponent());
    })(application = app.application || (app.application = {}));
})(app || (app = {}));

//# sourceMappingURL=app.application.js.map
