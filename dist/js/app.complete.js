var app;
(function (app) {
    var complete;
    (function (complete) {
        'use strict';
        var MainController = /** @class */ (function () {
            /* @ngInject */
            MainController.$inject = ["$timeout", "$state", "dataservice", "$stateParams"];
            function MainController($timeout, $state, dataservice, $stateParams) {
                this.$timeout = $timeout;
                this.$state = $state;
                this.dataservice = dataservice;
                this.$stateParams = $stateParams;
                this.application = {};
                if (dataservice.GLOBALS.form !== undefined) {
                    this.application = {
                        applicant: dataservice.GLOBALS.form.one.title + " " + dataservice.GLOBALS.form.one.firstName + " " + dataservice.GLOBALS.form.one.lastName,
                        decission: $stateParams.decission,
                        accountNumber: dataservice.GLOBALS.form.accountNumber,
                        contactBranchNumber: dataservice.GLOBALS.form.contactBranchNumber,
                        appNumber: dataservice.GLOBALS.token
                    };
                }
            }
            return MainController;
        }());
        complete.MainController = MainController;
        var MainComponent = /** @class */ (function () {
            function MainComponent() {
                this.restrict = 'E';
                this.controllerAs = "vm";
                this.templateUrl = 'dist/js/app.complete.html';
                this.controller = MainController;
            }
            return MainComponent;
        }());
        angular
            .module('app.complete', []);
        angular
            .module('app.complete').component('complete', new MainComponent());
    })(complete = app.complete || (app.complete = {}));
})(app || (app = {}));

//# sourceMappingURL=app.complete.js.map
