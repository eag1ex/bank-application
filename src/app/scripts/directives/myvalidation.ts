
module app.myvalidation {
    'use strict';
    class DirectiveController {
        /* @ngInject */
        constructor(public $rootScope: any) { }
    }

/**
 * uivalidation="{field:appForm.firstName, has:'input'}"
 * This validator sits on the input-group element and checks for inputs and select changes
 * It is a visual interpretor if/then errors accur.
 * It binds and watches for chages
 */


    angular.module('app.myvalidation', []);
    angular.module('app.myvalidation')
        .directive("uivalidation", [() => {

            return {
                restrict: "A",
                scope: {
                    myvalidation: "="
                },
                controller: DirectiveController,

                link: (scope, el, attrs, ctrl: DirectiveController) => {

                    scope.$watch('myvalidation', () => {
                        el.bind('change', (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            if (!el.hasClass('input-group')) {
                                console.log('element is not part of input-group');
                                return;
                            }

                            let field = scope.myvalidation.field;
                            let childSelector = scope.myvalidation.has;
                            let bothValid = scope.myvalidation.bothValid;
                            bothValid = (bothValid === undefined) ? true : bothValid;

                            console.log('bothValid', bothValid)
                            console.log('field name', field.$name)

                            //classes
                            let formClass = {
                                fs: 'form-control-success',
                                fd: 'form-control-danger',
                                hd: 'has-danger',
                                hs: 'has-success'
                            };
                            console.log('field.$valid', field.$valid)
                            if (field.$viewValue.length === 0 && field.$invalid === false) {
                                //    console.log(scope.myvalidation.field)
                                //  console.log('this element is empty or undefined')
                                // return;
                            }

                            let message = (isvalid) => {
                                let output;
                                if (isvalid) {
                                    output = "field is valid";
                                } else {
                                    output = "field is not valid";
                                }
                                return `<small class="form-text text-muted hide">${output}</small>`;
                            }


                            if (field.$valid && bothValid !== false) {
                                $(el).removeClass(formClass.hd)
                                $(el).removeClass(formClass.hs).addClass(formClass.hs);
                                angular.forEach(el.children(childSelector), function (value, inx) {
                                    //ONLY LOOP IF WE HAVE 2 INPUTS OR SELECT
                                    if (value.nodeName == 'INPUT' || value.nodeName == 'SELECT') {
                                        $(value).removeClass(formClass.fd)
                                        $(value).removeClass(formClass.fs).addClass(formClass.fs);
                                    }

                                });

                            }
                            if (field.$invalid || bothValid === false) {// || (field.$dirty === false && field.$viewValue.length > 0)
                                console.log('field.$valid', field.$valid)
                                console.log('field.$invalid', field.$invalid)
                                //elements[key].$setPristine()
                                // field.$setValidity("youAreFat", false);
                                $(el).removeClass(formClass.hs)
                                $(el).removeClass(formClass.hd).addClass(formClass.hd);

                                angular.forEach(el.children(childSelector), function (value, inx) {
                                    //ONLY LOOP IF WE HAVE 2 INPUTS OR SELECT
                                    if (value.nodeName == 'INPUT' || value.nodeName == 'SELECT') {
                                        $(value).removeClass(formClass.fs)
                                        $(value).removeClass(formClass.fd).addClass(formClass.fd);
                                    }
                                });

                            }
                        });
                    });
                }
            };
        }]);
}
