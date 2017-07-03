
module app.fileModel {
    'use strict';

    angular.module('app.fileModel', []);
    angular.module('app.fileModel')
         /* @ngInject */
        .directive("filemodel", ($parse) => {
            return {
                restrict: "A",

                link: function (scope, element, attrs) {
                    var model = $parse(attrs['filemodel']);// our name
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        console.log('file to upload modelSetter',modelSetter);
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        });
}
