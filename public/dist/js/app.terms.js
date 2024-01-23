var app;
(function (app) {
    var terms;
    (function (terms) {
        'use strict';
        var MainController = /** @class */ (function () {
            /* @ngInject */
            MainController.$inject = ["$scope", "$element", "$document", "$timeout", "$q", "$state", "dataservice"];
            function MainController($scope, $element, $document, $timeout, $q, $state, dataservice) {
                this.$scope = $scope;
                this.$element = $element;
                this.$document = $document;
                this.$timeout = $timeout;
                this.$q = $q;
                this.$state = $state;
                this.dataservice = dataservice;
                // dummy toke id:'sdfsdf345sw'  
            }
            MainController.prototype.gotoTest = function (state) {
                if (state === void 0) { state = 'welcome'; }
                this.$state.go(state);
            };
            MainController.prototype.acceptTerms = function (v) {
                var _this = this;
                this.dataservice.GLOBALS.terms = v;
                this.$timeout(function () {
                    _this.$state.go('application');
                }, 1500);
            };
            return MainController;
        }());
        terms.MainController = MainController;
        var MainComponent = /** @class */ (function () {
            function MainComponent() {
                this.restrict = 'E';
                this.controllerAs = "vm";
                this.templateUrl = 'dist/js/app.terms.html';
                this.controller = MainController;
            }
            return MainComponent;
        }());
        angular
            .module('app.terms', []);
        angular
            .module('app.terms').component('terms', new MainComponent());
    })(terms = app.terms || (app.terms = {}));
})(app || (app = {}));

//# sourceMappingURL=app.terms.js.map
