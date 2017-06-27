
module app.applicationForm {
    'use strict';
    class DirectiveController {
        static $inject: string[] = ['$rootScope', 'API', '$timeout'];
        constructor(public $rootScope: any, public API: any, public $timeout: any) { }
    }

    angular.module('app.applicationForm', []);
    angular.module('app.applicationForm')
        .directive("applicationForm", [() => {

            return {
                restrict: "E",
                scope:{
                    formdata:"="
                },
                controller: DirectiveController,

                templateUrl: "dist/js/application.form.html",

                link: (scope, el, attrs, ctrl: DirectiveController) => {

                    let API = ctrl.API;
                   // let DATA = ctrl.DATA;
                    let timeout = ctrl.$timeout;

                    el.bind('change', (event) => {
                        var file = event.target.files[0];
                        scope.file = file ? file : undefined;
                        scope.$apply();
                    });

                    /*

                    var updateDB = () => {
                        scope.$emit("updateDB", { data: true });
                    }

                    */
                    scope.fileLoading = false;

                    scope.uploadFile = () => {
                        scope.fileLoading = true;
                        var fileForm = el[0].firstChild;
                        var newData={
                            name:'mike',
                            number:12324345,
                            email:'mike@email.com'
                        }
                      //  fileForm = Object.assign(newData,fileForm);
                        console.log('fileForm',fileForm); 

                        $.ajax({
                            url: API.URL+"/send",
                            type: "POST",
                            data: new FormData(fileForm),
                            contentType: false,
                            cache: false,
                            processData: false,
                            success: (data) => {
                                console.log('success', data)
                               // updateDB();
                                scope.file = '';
                                scope.fileLoading = false;
                                return false;
                            },
                            error: (xhr, ajaxOptions, thrownError) => {
                                console.log(xhr.status);
                                console.log(thrownError);
                                return false;
                            }
                        });
                        return false;
                    }

                }
            };
        }]);
}
