
module app.validateNumber {
    'use strict';
    class DirectiveController {

        constructor() { }
    }   

    angular.module('app.validateNumber', []);
    angular.module('app.validateNumber')
        .directive("validnumber", () => {
            return {
                require: 'ngModel',
                controller: DirectiveController,
                link: (scope, elem, attr, ctrl: any) => {
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
                }////
            };
        });
}
