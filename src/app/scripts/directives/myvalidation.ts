
module app.uivalidation {
    'use strict';
    class DirectiveController {
        /* @ngInject */
        constructor(public $rootScope: any) { }
    }

    /**
     * uivalidation="{field:appForm.firstName, has:'input'}"
     * This validator sits on the input-group element and checks for input and select changes
     * It is a visual interpretor if/then errors accur.
     * It binds and watches for chages
     */


    angular.module('app.uivalidation', []);
    angular.module('app.uivalidation')
        .directive("uivalidation", () => {

            return {
                restrict: "A",
                scope: {
                    uivalidation: "="
                },
                controller: DirectiveController,

                link: (scope, el, attrs, ctrl: DirectiveController) => {

                    scope.$watch('uivalidation', () => {

                        el.bind('change', (event) => {
                            
                            event.preventDefault();
                            event.stopPropagation();

                            if (!el.hasClass('input-group')) {
                                return;
                            }

                            let field = scope.uivalidation.field;
                            let childSelector = scope.uivalidation.has;
                            let bothValid = scope.uivalidation.bothValid;
                            bothValid = (bothValid === undefined) ? true : bothValid;

                            //classes
                            let formClass = {
                                fs: 'form-control-success',
                                fd: 'form-control-danger',
                                hd: 'has-danger',
                                hs: 'has-success'
                            };

                            let message = (isvalid) => {
                                let output;
                                if (isvalid)  output = "field is valid";
                                else output = "field is not valid";
                                return `<small class="form-text text-muted hide">${output}</small>`;
                            }

                            // if input is $valid
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

                            // if input is $invalid
                            if (field.$invalid || bothValid === false) {
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
                        });//bind
                    });// $watch
                }//link
            };
        });
}
