var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var LayoutController = /** @class */ (function () {
            /* @ngInject */
            LayoutController.$inject = ["$rootScope", "dataservice", "$timeout", "$scope"];
            function LayoutController($rootScope, dataservice, $timeout, $scope) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.dataservice = dataservice;
                this.$timeout = $timeout;
                this.$scope = $scope;
                $rootScope.$on('onDataChange', function (e, data) {
                    $timeout(function () {
                        _this.appNumber = dataservice.GLOBALS.token;
                    }, 100);
                });
            }
            return LayoutController;
        }());
        layout.LayoutController = LayoutController;
        angular
            .module('app.layout', []);
        angular
            .module('app.layout')
            .controller('layoutController', LayoutController);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));

//# sourceMappingURL=app.layout.js.map
