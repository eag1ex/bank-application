var app;
(function (app) {
    var welcome;
    (function (welcome) {
        'use strict';
        var MainController = /** @class */ (function () {
            /**
             * app.welcome script registers new or existing token, call gets made to dataservice.registerUser
             * and if user is new then it will register or prompt that it exists and will redirect to terms page.
             * after post request is made, the data then gets cashed to the subsequent page, unless you refress the page,
             * no persistante cache have been integrated at this stage only RESTFUL api.
             */
            /* @ngInject */
            MainController.$inject = ["$scope", "$element", "$document", "$timeout", "$q", "dataservice", "$state"];
            function MainController($scope, $element, $document, $timeout, $q, dataservice, $state) {
                this.$scope = $scope;
                this.$element = $element;
                this.$document = $document;
                this.$timeout = $timeout;
                this.$q = $q;
                this.dataservice = dataservice;
                this.$state = $state;
                this.formOnsubmit = false;
                this.registerNewUser = {
                    valid: '',
                    invalid: ''
                };
            }
            MainController.prototype.redirectingToNext = function (state) {
                var _this = this;
                if (state === void 0) { state = 'welcome'; }
                this.$timeout(function () {
                    _this.$state.go(state);
                }, 2500);
            };
            MainController.prototype.registerUser = function () {
                var _this = this;
                if (this.$scope.welcomeForm.$invalid)
                    return;
                if (this.registerNewUser.valid) {
                    this.redirectingToNext('terms');
                    return;
                }
                // in case we do subsequent submit events;
                this.dataservice.resetExisting();
                this.formOnsubmit = true;
                var token = this.registerNewUser.token;
                this.dataservice.registerUser(token).then(function (data) {
                    var newData = data;
                    _this.existingUser = false;
                    _this.registerNewUser.invalid = false;
                    if (newData.invalidToken) {
                        _this.registerNewUser.valid = '';
                        _this.existingUser = false;
                        _this.registerNewUser.invalid = true;
                    }
                    if (newData.userExists === true) {
                        console.log('newData exists', newData);
                        // data is already cached at this point           
                        _this.registerNewUser.valid = false;
                        _this.existingUser = true;
                        // got to next page
                        if (newData.data.form !== undefined) {
                            _this.welcomeUser = newData.data.form.one.firstName;
                            _this.dataservice.GLOBALS.terms = newData.data.form.tc;
                        }
                        _this.clickToContinue = true;
                        _this.redirectingToNext('terms');
                    }
                    if (newData.userExists === false) {
                        // data is already cached at this point   
                        _this.existingUser = false;
                        _this.registerNewUser.valid = true;
                        // got to next page
                    }
                }, function (err) {
                    return err;
                }).catch(function (err) {
                    _this.registerNewUser.valid = false;
                    console.log('server error ', err);
                });
            };
            return MainController;
        }());
        welcome.MainController = MainController;
        var MainComponent = /** @class */ (function () {
            function MainComponent() {
                this.restrict = 'E';
                this.controllerAs = "vm";
                this.templateUrl = 'dist/js/app.welcome.html';
                this.controller = MainController;
            }
            return MainComponent;
        }());
        angular
            .module('app.welcome', []);
        angular
            .module('app.welcome').component('welcome', new MainComponent());
    })(welcome = app.welcome || (app.welcome = {}));
})(app || (app = {}));

//# sourceMappingURL=app.welcome.js.map
