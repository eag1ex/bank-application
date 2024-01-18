
module app.fileModel {
    'use strict';

    angular.module('app.fileModel', []);
    angular.module('app.fileModel')
        /* @ngInject */   
        .directive("filemodel", ($parse) => {
            return { 
                restrict: "A",

                link: function (scope, element, attrs) {
                    var model = $parse(attrs['filemodel']); // our name
                    var modelSetter = model.assign;

                    element.bind('change', (e) => {
                        let f = e.target.files[0];
                        let file = f ? f : undefined;

                        scope.$apply(function () {
                            //update ui message
                            scope.$emit("uploadedFile", { file: file.name, name: attrs.name });
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        });
}