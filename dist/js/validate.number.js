var app;
(function (app) {
    var validateNumber;
    (function (validateNumber) {
        'use strict';
        var DirectiveController = /** @class */ (function () {
            function DirectiveController() {
            }
            return DirectiveController;
        }());
        angular.module('app.validateNumber', []);
        angular.module('app.validateNumber')
            .directive("validnumber", function () {
            return {
                require: 'ngModel',
                controller: DirectiveController,
                link: function (scope, elem, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }
                    ctrl.$parsers.push(function (val) {
                        var good = val.replace(/[^0-9]+/g, '');
                        if (val !== good) {
                            ctrl.$setViewValue(good);
                            ctrl.$render();
                        }
                        return good;
                    });
                    elem.bind('keypress', function (event) {
                        if (event.keyCode === 32) {
                            event.preventDefault();
                        }
                    });
                } ////
            };
        });
    })(validateNumber = app.validateNumber || (app.validateNumber = {}));
})(app || (app = {}));

//# sourceMappingURL=validate.number.js.map
